import React from "react";

interface FormActionProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  type?: "Button" | "Input";
  action?: "submit" | "reset" | "button";
  text: string;
}

export default function FormAction({
  handleSubmit,
  type = "Button",
  action = "submit",
  text,
}: FormActionProps): JSX.Element {
  return (
    <>
      {type === "Button" ? (
        <button
          type={action}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-calypsoLight-300 hover:bg-calypsoLight-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleSubmit(e as any)
          }
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
