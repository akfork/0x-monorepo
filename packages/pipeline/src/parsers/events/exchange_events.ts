import { ExchangeCancelEventArgs, ExchangeCancelUpToEventArgs, ExchangeFillEventArgs } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { AssetProxyId, ERC721AssetData } from '@0x/types';
import { LogWithDecodedArgs } from 'ethereum-types';
import * as R from 'ramda';

import { ExchangeCancelEvent, ExchangeCancelUpToEvent, ExchangeFillEvent } from '../../entities';
import { bigNumbertoStringOrNull } from '../../utils';

/**
 * Parses raw event logs for a fill event and returns an array of
 * ExchangeFillEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export const parseExchangeFillEvents: (
    eventLogs: Array<LogWithDecodedArgs<ExchangeFillEventArgs>>,
) => ExchangeFillEvent[] = R.map(_convertToExchangeFillEvent);

/**
 * Parses raw event logs for a cancel event and returns an array of
 * ExchangeCancelEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export const parseExchangeCancelEvents: (
    eventLogs: Array<LogWithDecodedArgs<ExchangeCancelEventArgs>>,
) => ExchangeCancelEvent[] = R.map(_convertToExchangeCancelEvent);

/**
 * Parses raw event logs for a CancelUpTo event and returns an array of
 * ExchangeCancelUpToEvent entities.
 * @param eventLogs Raw event logs (e.g. returned from contract-wrappers).
 */
export const parseExchangeCancelUpToEvents: (
    eventLogs: Array<LogWithDecodedArgs<ExchangeCancelUpToEventArgs>>,
) => ExchangeCancelUpToEvent[] = R.map(_convertToExchangeCancelUpToEvent);

/**
 * Converts a raw event log for a fill event into an ExchangeFillEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function _convertToExchangeFillEvent(eventLog: LogWithDecodedArgs<ExchangeFillEventArgs>): ExchangeFillEvent {
    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.makerAssetData);
    const makerAssetType = makerAssetData.assetProxyId === AssetProxyId.ERC20 ? 'erc20' : 'erc721';
    const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.takerAssetData);
    const takerAssetType = takerAssetData.assetProxyId === AssetProxyId.ERC20 ? 'erc20' : 'erc721';
    const exchangeFillEvent = new ExchangeFillEvent();
    exchangeFillEvent.contractAddress = eventLog.address as string;
    exchangeFillEvent.blockNumber = eventLog.blockNumber as number;
    exchangeFillEvent.logIndex = eventLog.logIndex as number;
    exchangeFillEvent.rawData = eventLog.data as string;
    exchangeFillEvent.transactionHash = eventLog.transactionHash;
    exchangeFillEvent.makerAddress = eventLog.args.makerAddress;
    exchangeFillEvent.takerAddress = eventLog.args.takerAddress;
    exchangeFillEvent.feeRecipientAddress = eventLog.args.feeRecipientAddress;
    exchangeFillEvent.senderAddress = eventLog.args.senderAddress;
    exchangeFillEvent.makerAssetFilledAmount = eventLog.args.makerAssetFilledAmount;
    exchangeFillEvent.takerAssetFilledAmount = eventLog.args.takerAssetFilledAmount;
    exchangeFillEvent.makerFeePaid = eventLog.args.makerFeePaid;
    exchangeFillEvent.takerFeePaid = eventLog.args.takerFeePaid;
    exchangeFillEvent.orderHash = eventLog.args.orderHash;
    exchangeFillEvent.rawMakerAssetData = eventLog.args.makerAssetData;
    exchangeFillEvent.makerAssetType = makerAssetType;
    exchangeFillEvent.makerAssetProxyId = makerAssetData.assetProxyId;
    exchangeFillEvent.makerTokenAddress = makerAssetData.tokenAddress;
    // tslint has a false positive here. Type assertion is required.
    // tslint:disable-next-line:no-unnecessary-type-assertion
    exchangeFillEvent.makerTokenId = bigNumbertoStringOrNull((makerAssetData as ERC721AssetData).tokenId);
    exchangeFillEvent.rawTakerAssetData = eventLog.args.takerAssetData;
    exchangeFillEvent.takerAssetType = takerAssetType;
    exchangeFillEvent.takerAssetProxyId = takerAssetData.assetProxyId;
    exchangeFillEvent.takerTokenAddress = takerAssetData.tokenAddress;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    exchangeFillEvent.takerTokenId = bigNumbertoStringOrNull((takerAssetData as ERC721AssetData).tokenId);
    return exchangeFillEvent;
}

/**
 * Converts a raw event log for a cancel event into an ExchangeCancelEvent
 * entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function _convertToExchangeCancelEvent(
    eventLog: LogWithDecodedArgs<ExchangeCancelEventArgs>,
): ExchangeCancelEvent {
    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.makerAssetData);
    const makerAssetType = makerAssetData.assetProxyId === AssetProxyId.ERC20 ? 'erc20' : 'erc721';
    const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(eventLog.args.takerAssetData);
    const takerAssetType = takerAssetData.assetProxyId === AssetProxyId.ERC20 ? 'erc20' : 'erc721';
    const exchangeCancelEvent = new ExchangeCancelEvent();
    exchangeCancelEvent.contractAddress = eventLog.address as string;
    exchangeCancelEvent.blockNumber = eventLog.blockNumber as number;
    exchangeCancelEvent.logIndex = eventLog.logIndex as number;
    exchangeCancelEvent.rawData = eventLog.data as string;
    exchangeCancelEvent.transactionHash = eventLog.transactionHash;
    exchangeCancelEvent.makerAddress = eventLog.args.makerAddress;
    exchangeCancelEvent.takerAddress = eventLog.args.takerAddress;
    exchangeCancelEvent.feeRecipientAddress = eventLog.args.feeRecipientAddress;
    exchangeCancelEvent.senderAddress = eventLog.args.senderAddress;
    exchangeCancelEvent.orderHash = eventLog.args.orderHash;
    exchangeCancelEvent.rawMakerAssetData = eventLog.args.makerAssetData;
    exchangeCancelEvent.makerAssetType = makerAssetType;
    exchangeCancelEvent.makerAssetProxyId = makerAssetData.assetProxyId;
    exchangeCancelEvent.makerTokenAddress = makerAssetData.tokenAddress;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    exchangeCancelEvent.makerTokenId = bigNumbertoStringOrNull((makerAssetData as ERC721AssetData).tokenId);
    exchangeCancelEvent.rawTakerAssetData = eventLog.args.takerAssetData;
    exchangeCancelEvent.takerAssetType = takerAssetType;
    exchangeCancelEvent.takerAssetProxyId = takerAssetData.assetProxyId;
    exchangeCancelEvent.takerTokenAddress = takerAssetData.tokenAddress;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    exchangeCancelEvent.takerTokenId = bigNumbertoStringOrNull((takerAssetData as ERC721AssetData).tokenId);
    return exchangeCancelEvent;
}

/**
 * Converts a raw event log for a cancelUpTo event into an
 * ExchangeCancelUpToEvent entity.
 * @param eventLog Raw event log (e.g. returned from contract-wrappers).
 */
export function _convertToExchangeCancelUpToEvent(
    eventLog: LogWithDecodedArgs<ExchangeCancelUpToEventArgs>,
): ExchangeCancelUpToEvent {
    const exchangeCancelUpToEvent = new ExchangeCancelUpToEvent();
    exchangeCancelUpToEvent.contractAddress = eventLog.address as string;
    exchangeCancelUpToEvent.blockNumber = eventLog.blockNumber as number;
    exchangeCancelUpToEvent.logIndex = eventLog.logIndex as number;
    exchangeCancelUpToEvent.rawData = eventLog.data as string;
    exchangeCancelUpToEvent.transactionHash = eventLog.transactionHash;
    exchangeCancelUpToEvent.makerAddress = eventLog.args.makerAddress;
    exchangeCancelUpToEvent.senderAddress = eventLog.args.senderAddress;
    exchangeCancelUpToEvent.orderEpoch = eventLog.args.orderEpoch;
    return exchangeCancelUpToEvent;
}
