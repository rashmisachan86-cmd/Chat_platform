import mongoose from 'mongoose';
declare const User: mongoose.Model<{
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    username: string;
    password: string;
    gender: "Boy" | "Girl";
    vibe: string;
    accentColor: string;
    chatWallpaper: string;
    soundsEnabled: boolean;
    lastActive: NativeDate;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=User.d.ts.map