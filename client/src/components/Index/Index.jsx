import Widget from "./Widget";
import WidgetTotal from "./WidgetTotal";

const Index = (props) => {
  const data = [
    {
      name: "Western Power Sports",
      url: "/products?vendor=WPS",
      data: props.wpsData,
    },
    {
      name: "Parts Unlimited",
      url: "/products?vendor=PU",
      data: props.puData,
    },
    {
      name: "Helmet House",
      url: "/products?vendor=HH",
      data: props.hhData,
    },
    {
      name: "LS 2",
      url: "/products?vendor=LS",
      data: props.lsData,
    },
    // {
    //   name: "Tucker",
    //   url: "/products?vendor=TR",
    //   data: props.trData,
    // },
  ];
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">Dashboard</h1>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="grid grid-cols-1 lg:grid-1/3 lg:grid-cols-2 gap-10 w-full mb-10">
          {data.map((vendor, i) => (
            <Widget
              key={i}
              title={vendor.name}
              link={vendor.url}
              data={vendor.data}
            />
          ))}
        </div>
        <div className="w-full lg:w-2/6 lg:ml-10">
          <WidgetTotal data={props.data} />
        </div>
      </div>
    </>
  );
};

export default Index;
