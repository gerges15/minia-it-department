export default function SuccessMessage({ successMessage }) {
    return (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md text-sm text-green-700">
            {successMessage}
        </div>
    );
}
