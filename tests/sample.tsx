export const Sample = props =>
   <ul>{Object.entries(props).map(SampleItem)}</ul>

function SampleItem([field, value], index) {
  value =
    typeof value == "object"
      ? JSON.stringify(value)
      : typeof value == "string"
      ? '"' + value + '"'
      : typeof value == "boolean"
      ? value.toString()
      : value;

  return (
    <li key={index}>
      {field}: {value}
    </li>
  );
}
