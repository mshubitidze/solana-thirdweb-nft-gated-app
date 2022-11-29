import PissPuddle from "../public/PISS_ROUND.png";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useClaimNFT,
  useLogin,
  useLogout,
  useProgram,
  useUser,
  useDropUnclaimedSupply,
  useNFTs,
  useDropTotalClaimedSupply,
} from "@thirdweb-dev/react/solana";
import { wallet } from "./_app";
import { useRouter } from "next/router";
import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import Image from "next/image";

function LoginPage() {
  const [usersNft, setUsersNft] = useState<NFT | undefined>();

  const login = useLogin();
  const logout = useLogout();
  const router = useRouter();
  const { user } = useUser();
  const { publicKey, connect, select } = useWallet();

  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  );

  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  useEffect(() => {
    if (!publicKey) {
      select(wallet.name);
      connect();
    }
  }, [publicKey, wallet]);

  useEffect(() => {
    if (!user || !nfts) return;

    const usersNft = nfts.find((nft) => nft.owner === user?.address);

    if (usersNft) {
      setUsersNft(usersNft);
    }
  }, [nfts, user]);

  const handleLogin = async () => {
    await login();
    router.replace("/");
  };

  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B]">
      <div className="overflow-hidden absolute left-0 top-56 w-full h-1/4 bg-fuchsia-600 shadow-xl -skew-y-6" />
      <div className="z-30 mt-5 mb-10 bg-white rounded-full shadow-2xl h-[400px]">
        <Image
          className=""
          src={PissPuddle}
          alt="logo"
          width={400}
          height={400}
        />
      </div>
      <main className="z-30 text-white">
        <h1 className="text-4xl font-bold uppercase">
          Welcome to the <span className="text-fuchsia-600">PISS</span>
        </h1>
        {!user && (
          <div>
            <button
              onClick={handleLogin}
              className="py-4 px-10 mt-5 mb-5 text-2xl font-bold text-white bg-fuchsia-600 rounded-md border-2 border-fuchsia-600 transition duration-200 animate-pulse"
            >
              Login / Connect Wallet
            </button>
          </div>
        )}

        {user && (
          <div>
            <p className="mb-10 text-lg font-bold text-fuchsia-600">
              Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
            </p>

            {isLoading && (
              <div className="py-4 px-10 mb-5 text-2xl font-bold text-white bg-fuchsia-600 rounded-md border-2 border-fuchsia-600 transition duration-200 animate-pulse">
                Hold on, We're just looking for your PISS Membership Pass
              </div>
            )}

            {usersNft && (
              <div className="py-4 px-10 mt-5 mb-5 text-2xl font-bold text-white uppercase bg-fuchsia-600 rounded-md border-2 border-fuchsia-600 transition duration-200 animate-pulse hover:text-fuchsia-600 hover:bg-white">
                <Link href="/">ACCESS GRANTED - ENTER</Link>
              </div>
            )}

            {!usersNft &&
              !isLoading &&
              (unclaimedSupply && unclaimedSupply > 0 ? (
                <button
                  onClick={handlePurchase}
                  className="py-4 px-10 mt-5 font-bold text-white uppercase bg-fuchsia-600 rounded-md border-2 border-fuchsia-600 transition duration-200 hover:text-fuchsia-600 hover:bg-white"
                >
                  Buy a PISS Membership Pass
                </button>
              ) : (
                <p className="py-4 px-10 mb-5 text-2xl font-bold text-white uppercase bg-red-500 rounded-md border-2 border-red-500 transition duration-200">
                  Sorry, we're all out of PISS Membership Passes!
                </p>
              ))}
          </div>
        )}

        {user && (
          <button
            onClick={logout}
            className="py-4 px-10 mt-10 font-bold text-fuchsia-600 uppercase bg-white rounded-md border-2 border-fuchsia-600 transition duration-200 hover:text-white hover:bg-fuchsia-600"
          >
            logout
          </button>
        )}
      </main>
    </div>
  );
}

export default LoginPage;
