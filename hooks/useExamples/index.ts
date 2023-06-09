import { ChangeEvent, useCallback, useState } from "react";

export type ExampleProps = { 
    path: string, 
    name: string 
  };

export const BLANK_EXAMPLE : ExampleProps = { path: "", name: "Examples" }

export const EXAMPLES_LIST: ExampleProps[] = [
    {
        "path" : "/examples/itemizer",
        "name" : "🍥 ERC-6551 Itemizer"
    },
    {
        "path" : "/examples/tokenuri",
        "name" : "🖼️ Tokenuri Server"
    },
    {
        "path" : "/examples/contract",
        "name" : "📜 Contract"
    },
    {
        "path" : "/examples/indexer",
        "name" : "🔗 Basic Indexer"
    },
    {
        "path" : "/examples/tbasnapshot",
        "name" : "📸 TBA Snapshot"
    }


]

export const useExamples = () => {
    const [example, setExample] = useState(BLANK_EXAMPLE);
  
    return { example, setExample };
};
