import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useLogout } from "@thirdweb-dev/react/solana";
import type { GetServerSideProps } from "next";
import { getUser } from "../auth.config";
import { network } from "./_app";
import Image from "next/image";
import Link from "next/link";
import PissPuddleRect from "../public/PISS.png";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  // Check if the user has the NFT and then allow/disallow access
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );

  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  if (!nft)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

const Home = () => {
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B] -z-20 px-5">
      <p className="fixed top-10 py-3 px-4 mx-10 text-xs font-bold text-white bg-red-500 rounded-full md:px-8 md:text-base">
        MEMBERS ONLY: This page is only accessible to users who have purchased &
        hold a PISS NFT
      </p>
      <div className="overflow-hidden absolute left-0 z-10 w-full h-1/2 bg-transparent -skew-y-6 top-50">
        <div className="flex items-center w-full h-full opacity-30">
          <h1 className="-mx-20 text-xl font-bold text-center text-white md:text-2xl lg:text-3xl">
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
          </h1>
        </div>
      </div>
      <section className="z-10 space-y-2 md:mb-10">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Introducing the{" "}
          <span className="text-fuchsia-600">University of Piss</span>
        </h1>
        <h2 className="text-xl lg:text-3xl">
          <span className="font-extrabold underline decoration-fuchsia-600">
            Daily
          </span>{" "}
          Pissing problems (with solution) delivered straight to your inbox!
        </h2>
      </section>
      <div className="z-10 mt-5 mb-10 shadow-2xl h-[400px]">
        <Image src={PissPuddleRect} alt="logo" width={528} height={400} />
      </div>
      <div className="z-50 my-5 text-lg font-extrabold text-black transition duration-200 md:text-2xl hover:underline">
        <Link href="https://pornhub.com">
          <a>
            Visit{" "}
            <span className="font-extrabold text-fuchsia-600 underline transition duration-200 decoration-fuchsia-600">
              pornhub.com/piss
            </span>{" "}
            to sign up Today!
          </a>
        </Link>
      </div>
      <button
        className="z-50 py-4 px-10 mt-5 font-bold text-white uppercase bg-fuchsia-600 rounded-md border-fuchsia-600 transition duration-200 hover:text-fuchsia-600 hover:bg-white border2"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
