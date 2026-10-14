import zod from 'zod';

export const SendOtpEventSchema  = zod.object({
    eventId : zod.string().min(1),
    email : zod.string().email(),
    otp : zod.string().min(1)  ,
    // type : zod.enum(['signup', 'login', 'reset-password'])
    type: zod.literal("SEND_OTP"), 
    createdAt : zod.string().min(1),
    expiresAt :  zod.number().int().positive().optional(),

})

export type SendOtpEvent = zod.infer<typeof SendOtpEventSchema>