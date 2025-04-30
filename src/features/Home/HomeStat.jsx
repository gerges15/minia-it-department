export default function HomeStat(props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <props.icon className={`h-8 w-8 ${props.color}`} />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{props.name}</p>
          <p className="text-2xl font-semibold text-gray-900">{props.value}</p>
        </div>
      </div>
    </div>
  );
}
