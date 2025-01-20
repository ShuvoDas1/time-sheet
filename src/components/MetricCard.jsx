import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
const MetricCard = ({ title, value }) => {
  return (
    <>
      {/* <div className="rounded-lg border shadow-md p-6 bg-white text-center">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
      </div> */}
      <Card className="w-full mt-5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default MetricCard;
