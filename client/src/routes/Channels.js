import defaultImg from "../assets/default-image.png";
import logoAMAZON from "../assets/channels/amazon-logo.png";

const Channels = () => {
  const data = [
    {
      name: "Amazon",
      url: "/channel?vendor=AMAZON",
      image_url: logoAMAZON,
    },
  ];
  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">Channels</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-1/3 lg:grid-cols-3 gap-10 w-full mb-10">
        {data.map((vendor, i) => (
          <a
            key={i}
            className="relative w-full px-4 py-6 bg-white shadow-lg border-2 border-white hover:border-blue-500"
            href={vendor.url}
          >
            <img
              src={vendor.image_url ? vendor.image_url : defaultImg}
              alt={vendor.name}
            />
            <h3 className="text-center text-lg font-bold mt-4 pt-4 border-t">
              {vendor.name}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Channels;
