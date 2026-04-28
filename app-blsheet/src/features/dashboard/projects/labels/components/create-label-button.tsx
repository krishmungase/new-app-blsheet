import { Button } from "@/components";

const CreateLabelButton = ({
  toggleCreateLabel,
}: {
  toggleCreateLabel: () => void;
}) => {
  return (
    <Button size="sm" onClick={toggleCreateLabel}>
      New label
    </Button>
  );
};

export default CreateLabelButton;
