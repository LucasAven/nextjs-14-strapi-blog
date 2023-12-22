interface VisuallyHiddenTextProps {
  description: string;
}
export const VisuallyHiddenText = ({
  description,
}: VisuallyHiddenTextProps) => {
  return (
    <span aria-live="polite" className="sr-only" role="status">
      {description}
    </span>
  );
};
