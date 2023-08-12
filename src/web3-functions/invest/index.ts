/* eslint-disable @typescript-eslint/naming-convention */
import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";
import safeABI from "./safeABI.json";
import routerABI from "./routerABI.json";

const
    safeModuleAddress = "0xbb97656cd5fece3a643335d03c8919d5e7dcd225",
    uniswapRouterAddress = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    usdcAddress = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    amount = 1,
    CALL = 0

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();
  ////// User Arguments
  const targetAddress = userArgs.targetAddress as string;
  console.log("targetAddress", targetAddress);

  const network = await provider.getNetwork()
  console.log(network)

  if (!targetAddress)
    throw new Error("Missing userArgs.targetAddress please provide");

  // Get safeModule contract
  const safeModule = new Contract(safeModuleAddress, safeABI, provider);
  const uniswapRouter = new Contract(uniswapRouterAddress, routerABI, provider);

  const addresses: string[] = [];
  const callDatas: Array<{ to: string; data: string }> = [];
  const execData = uniswapRouter.interface.encodeFunctionData("exactInputSingle", [
    {
      tokenIn: usdcAddress,
      tokenOut: wethAddress,
      fee: 3000,
      recipient: targetAddress,
      deadline: 0,
      amountIn: amount,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    }
  ])

  callDatas.push({
      to: safeModule.address,
      data: safeModule.interface.encodeFunctionData("execute", [
        targetAddress,
        [
          {
            to: uniswapRouterAddress,
            data: execData,
            value: amount,
            operation: CALL,
          }
        ]
      ]),
  });

  return {
    canExec: true,
    callData: callDatas,
  };
});
