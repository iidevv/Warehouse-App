import defaultImg from "../assets/default-image.png";
import logoHH from "../assets/vendors/HH.jpg";
import logoWPS from "../assets/vendors/WPS.jpg";
import logoPU from "../assets/vendors/PU.jpg";
import logoLS from "../assets/vendors/LS.jpg";
import logoTURN from "../assets/vendors/TURN.jpg";
import logoTORC from "../assets/vendors/TORC.jpg";

// vendor connection point

const Catalogs = () => {
  const data = [
    {
      name: "Western Power Sports",
      url: "/catalog?vendor=WPS",
      image_url: logoWPS,
    },
    {
      name: "Parts Unlimited",
      url: "/catalog?vendor=PU",
      image_url: logoPU,
    },
    {
      name: "Helmet House",
      url: "/catalog?vendor=HH",
      image_url: logoHH,
    },
    {
      name: "LS 2",
      url: "/catalog?vendor=LS",
      image_url: logoLS,
    },
    {
      name: "Turn 14",
      url: "/catalog?vendor=TURN",
      image_url: logoTURN,
    },
    {
      name: "TORC",
      url: "/catalog?vendor=TORC",
      image_url: logoTORC,
    },
  ];
  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">Catalogs</h1>
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

export default Catalogs;
