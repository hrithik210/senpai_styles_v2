import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="relative flex justify-between items-center text-center gap-2">
      <div className="relative flex items-center">
        <span className="text-white">
          <Image src={"/logo.avif"} alt="logo" width={125} height={88} />
        </span>
      </div>

      <div className="relative flex items-center gap-4">
        <p className="text-sm gap-x-2">About</p>
        <p className="text-sm">Contact</p>
      </div>

      <div className="relative flex text-center gap-4 p-4">
        <span className="text-white gap-2 mr-2 ">
          <Image
            src={"/user.svg"}
            alt="user"
            width={20}
            height={10}
            style={{ filter: "invert(1)" }}
          />
        </span>

        <span className="text-white gap-2 mr-2 ">
            <Image
            src={"/shopping-bag.png"}
            alt="user"
            width={20}
            height={15}
            style={{ filter: "invert(1)" }}
          />
        </span>
      </div>
    </div>
  );
};
