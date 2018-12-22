import { ConnectionOptions } from 'typeorm';

import {
    Block,
    CopperActivity,
    CopperActivityType,
    CopperCustomField,
    CopperLead,
    CopperOpportunity,
    DexTrade,
    ERC20ApprovalEvent,
    ExchangeCancelEvent,
    ExchangeCancelUpToEvent,
    ExchangeFillEvent,
    OHLCVExternal,
    Relayer,
    SraOrder,
    SraOrdersObservedTimeStamp,
    TokenMetadata,
    TokenOrderbookSnapshot,
    Transaction,
} from './entities';

const entities = [
    Block,
    CopperOpportunity,
    CopperActivity,
    CopperActivityType,
    CopperCustomField,
    CopperLead,
    DexTrade,
    ExchangeCancelEvent,
    ExchangeCancelUpToEvent,
    ExchangeFillEvent,
    ERC20ApprovalEvent,
    OHLCVExternal,
    Relayer,
    SraOrder,
    SraOrdersObservedTimeStamp,
    TokenMetadata,
    TokenOrderbookSnapshot,
    Transaction,
];

const config: ConnectionOptions = {
    type: 'postgres',
    url: 'postgresql://localhost:5432/datapipeline_test_copper',
    synchronize: false,
    logging: ['error'],
    entities,
    migrations: ['./lib/migrations/**/*.js'],
};

module.exports = config;
