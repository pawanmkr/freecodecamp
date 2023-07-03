import { ChangeEvent } from "react";

const SearchBox = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target;
    console.log(value);
  };

  return (
    <div>
      <input
        className="opacity-50"
        type="text"
        placeholder="Search 8000+ tutorials"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
