const WpsItem = (props) => {
  const link = props.item.product_id ? `/wps-product/${props.item.product_id}` : "#";
  const sku = props.item.sku;
  const name = props.item.name;
  const total =
    props.item.inventory && props.item.inventory.data ? props.item.inventory.data.total : 0;
  const in_stock =
    total > 0
      ? "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-green-500"
      : "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-red-500";
  if (total) {
    return (
      <a
        href={link}
        target="_blank"
        className="flex justify-between px-4 py-2 border-t transition hover:bg-gray-100"
      >
        <span className="inline-block pl-2">{sku}</span>
        <span className="inline-block pl-2">{name}</span>
        <span className={in_stock}>{total}</span>
      </a>
    );
  }
  return (
    <span className="flex justify-between px-4 py-2 border-t transition bg-gray-100">
      <span className="inline-block pl-2">{sku}</span>
      <span className="inline-block pl-2">{name}</span>
      <span className={in_stock}>{total}</span>
    </span>
  );
};

export default WpsItem;
