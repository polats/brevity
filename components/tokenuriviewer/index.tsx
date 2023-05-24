import { useEffect } from "react";
import { useTokenUri } from "../../hooks/useTokenUri";

type UriViewerProps = {
    uri: string;
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

export const TokenUriViewer = ({ uri }: UriViewerProps) => {
    const { data, isLoading, isError, error } = useTokenUri(uri);    

    return (
        <div className="overflow-auto max-h-96">
        {
            data ? 
            renderJSON(data) :
                "No data found"
        }
        </div>
  )
}


