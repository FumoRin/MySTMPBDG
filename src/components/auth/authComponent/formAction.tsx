interface FormActionProps {
  isLoading: boolean;
  text: string;
}

const FormAction = ({ isLoading, text }: FormActionProps) => {
  return (
    <div className="pt-4">
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {text}
      </button>
    </div>
  );
};

export default FormAction;
