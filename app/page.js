import Image from "next/image";
import Slider from "./_component/Slider";
import CategoryList from "./_component/CategoryList";
import ProductList from "./_component/ProductList";

export default function Home() {
  return (
    <div className=" p-5 md:p-10 md:px-16 px-4">
      <Slider />
      <h2 className="text-[12px] pt-1 text-center align-center text-green-900 px-5">
        {" "}
        @ Developed by YOUR_NAME During React-Next Workshop{" "}
      </h2>
      <CategoryList />
      <ProductList />
      {/* Banner */}
      <Image
        src={"/banner.jpg"}
        alt="banner"
        width={1000}
        height={400}
        className="w-full mt-12"
      />
    </div>
  );
}
