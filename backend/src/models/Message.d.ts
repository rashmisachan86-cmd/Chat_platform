import mongoose from 'mongoose';
declare const Message: mongoose.Model<{
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    type: "text" | "image" | "audio";
    from: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    isSecret: boolean;
    status: "sent" | "delivered" | "read";
    reactions: string[];
    isStarred: boolean;
    text?: string | null;
    contentUrl?: string | null;
    replyTo?: mongoose.Types.ObjectId | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Message;
//# sourceMappingURL=Message.d.ts.map