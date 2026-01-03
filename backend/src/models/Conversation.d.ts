import mongoose from 'mongoose';
declare const Conversation: mongoose.Model<{
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    participants: mongoose.Types.ObjectId[];
    isGroup: boolean;
    lastMessage?: string | null;
    avatar?: string | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Conversation;
//# sourceMappingURL=Conversation.d.ts.map