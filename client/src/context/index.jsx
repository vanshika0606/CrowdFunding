import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x0CdE956a1fa76844B4c8371C5E020563CeE5Dae4"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const { data, isLoading } = useContractRead(contract, "getcampaigns")
  // console.log("data : ", data);
  // console.log("isLoading: ", isLoading);


  const address = useAddress();
  const connect = useMetamask();


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
    
      if(!isLoading){
        console.log(data);
      }
    
    const parsedCampaings = data?.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    // console.log(parsedCampaings);

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }


  return (
    <StateContext.Provider
      value={{ address, contract, connect, createCampaign: publishCampaign, getCampaigns, getUserCampaigns, isLoading, data}}
    >
       {children}
    </StateContext.Provider>
  );
};

export const useStateContext = ()=> useContext(StateContext);
