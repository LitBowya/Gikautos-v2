import { PropagateLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center">
      <PropagateLoader color="rgb(146, 9, 9)" size={7} speedMultiplier={1} />
    </div>
  );
};

export default Loader;
