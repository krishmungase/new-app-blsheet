import { useEffect } from "react";

const useUpdateDocumentTitle = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, []);
};

export default useUpdateDocumentTitle;
