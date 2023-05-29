import { useEffect, useState } from "react";
import { useTokenUri } from "../../hooks/useTokenUri";
import JSZip from 'jszip';
import xml2js from 'xml2js';
import sharp from 'sharp';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { ClipboardCopier } from "../../components/clipboardcopier";

const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false}
)

type OraGalleryProps = {
    path: string;
}

type LayerInfo = {
  src: string;
  name: string;
  visibility: string;
  x: string;
  y: string;
};

type ImageBufferWithOffset = {
buffer: Buffer;
x: number;
y: number;
};

    const getImageSizeFromXml = async (xmlString: string) => {
      const parser = new xml2js.Parser()
    
      const result = await parser.parseStringPromise(xmlString)
      const imageComponent = result?.image
  
      if (!imageComponent) {
        throw new Error('No image component found in stack.xml')
      }
    
      const width = parseInt(imageComponent.$.w, 10)
      const height = parseInt(imageComponent.$.h, 10)
    
      return { width, height }
    }
  
  
    const getStackNamesFromRootNode = (rootNode: any) => {
      const stackChildren = rootNode.stack
    
      if (!stackChildren) {
        return []
      }
    
      const stackNames: string[] = stackChildren.map((stack: any) => stack.$.name)
      return stackNames
    }
  
    const findLayerStack = (component: any, targetLayerName: string): any => {
  
      if (component.$.name === targetLayerName) {
        return component
      }
    
      if (component.stack) {
        for (const childStack of component.stack) {
          const result = findLayerStack(childStack, targetLayerName)
          if (result) {
            return result
          }
        }
      }
    
      return null
    }
    
    const getLayersFromXml = async (xmlString: string) => {
      const parser = new xml2js.Parser()
    
      const result = await parser.parseStringPromise(xmlString)
      const rootNode = result?.image.stack[0].stack[0] // assumes a parent Root layer in the ORA file
    
      if (!rootNode) {
        throw new Error('Root node not found in stack.xml')
      }
    
      const stackNames = getStackNamesFromRootNode(rootNode)
    
      const allLayerInfoArray: Array<LayerInfo> = []
    
      for (const targetLayerName of stackNames) {
        const targetStack = findLayerStack(rootNode, targetLayerName)
    
        if (!targetStack) {
          continue
        }
    
        const layerComponents = targetStack.layer
    
        const layerInfoArray: Array<LayerInfo> = layerComponents
        .map((layer: any) => ({
          src: layer.$.src,
          name: layer.$.name,
          visibility: layer.$.visibility,
          x: layer.$.x,
          y: layer.$.y
        }))
  
    
        if (layerInfoArray.length > 0) {
          for (var i = 0; i < layerInfoArray.length; i++) {
              allLayerInfoArray.push(layerInfoArray[i])
          }
        }
      }
    
      return allLayerInfoArray
    }

    const renderJSON = (obj) => {
      if (typeof obj !== 'object' || obj === null) {
        // Base case: render primitive values
        return <span>{String(obj)}</span>;
      } else if (Array.isArray(obj)) {
        // Render arrays
        return (
          <ul>
            {obj.map((item, index) => (
              <li key={index}>{renderJSON(item)}</li>
            ))}
          </ul>
        );
      } else {
        // Render objects
        return (
          <ul>
            {Object.keys(obj).map((key) => (
              <li key={key}>
                <strong>{key}: </strong>
                {renderJSON(obj[key])}
              </li>
            ))}
          </ul>
        );
      }
      }
      

export const ORAGallery = ({ path }: OraGalleryProps) => {

    const [oraData, setOraData] = useState([]);
    const [partsArray, setPartsArray] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [imageSrc, setImageSrc] = useState('');

    const clickPart = (e) => {
      if (e.name === "src") {
        drawPart(e.value);
      }
    }

    const drawPart = async (imagePath) => {
      setSelectedPart(imagePath);
      const response = await fetch(path);
      const zip = await JSZip.loadAsync(await response.arrayBuffer());
      const imageData = await zip.file(imagePath).async('base64');
      setImageSrc(`data:image/jpeg;base64, ${imageData}`);
    }

    const fetchOraData = async () => {
      try {
        
          const response = await fetch(path);
          const zip = await JSZip.loadAsync(await response.arrayBuffer());
          const xmlString = await zip.file('stack.xml').async('string');
          const partsArray = await getLayersFromXml(xmlString);    
          const { width, height } = await getImageSizeFromXml(xmlString);

          setPartsArray(partsArray);
    
      } catch (error) {
          console.log(error);
      }
  }

    useEffect(() => {
        fetchOraData();        
    }, [path])

    // const { data, isLoading, isError, error } = useTokenUri(uri);    

    return (
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-y-auto h-36">
          {
              partsArray &&
              <ReactJson src={partsArray} theme="hopscotch" onSelect={clickPart} enableClipboard={false}/>
          }
          {
              // data ? 
              // renderJSON(data) :
              //     "No data found"
          }
          </div>

          <div>
          {selectedPart}

            {imageSrc ? (
              <div  style={{width: '100%', height: '100%', position: 'relative'}}>
                <Image 
                  src={imageSrc} 
                  alt={selectedPart} 
                  layout='fill'
                  objectFit='contain'                />
              </div>
            ) : (
              <p>No image selected</p>
            )}

          </div>          
        </div>
  )
}


