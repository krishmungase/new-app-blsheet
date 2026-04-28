import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const Thumbnail = ({ url }: { url: string }) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[300px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Image"
            className="rounded-md object-cover size-full "
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border flex items-center justify-center p-0 shadow-none">
        <img src={url} alt="Image" className="rounded-md object-cover" />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
