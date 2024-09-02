
import { ScaleLoader } from "react-spinners";

const PageLoader = () => {
  return (
      <div style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
    }}>
      <ScaleLoader
        color="rgb(146, 9, 9)"
        height={50}
        margin={5}
        radius={49}
        width={8}
      />
    </div>
  );
};

export default PageLoader;
