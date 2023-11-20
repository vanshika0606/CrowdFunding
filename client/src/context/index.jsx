import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x09472583922Bc5508F762326AEd66CB65216041c"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const { mutateAsync: deleteCampaign } = useContractWrite(
    contract,
    "deleteCampaign"
  );
  const { mutateAsync: updateDonationHash } = useContractWrite(
    contract,
    "updateDonationHash"
  );

  const { data, isLoading } = useContractRead(contract, "getcampaigns");
  // console.log("data cont : ", data);
  // console.log("isLoading: ", isLoading);

  const address = useAddress();
  const connect = useMetamask();

  const updateHash = async (Id, hash) => {
    try {
      const data = await updateDonationHash({ args: [Id, hash] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!isLoading) {
      console.log(data);
    }

    const parsedCampaings = data?.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      creationTime: campaign.creationTime.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    console.log(parsedCampaings);

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateTocampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });
    await updateHash(pId, data?.receipt?.transactionHash);
    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];
    const hash = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
      hash.push(donations[2][i]);
    }
    return { parsedDonations, hash };
  };

  const campaignDelete = async (Id) => {
    try {
      const data = await deleteCampaign({ args: [Id] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        isLoading,
        data,
        deleteCampaign: campaignDelete,
        getDonations,
        donate,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
