import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { eq } from 'drizzle-orm';
import { usersTable } from './src/db/schema/user-schemas/users';
import { db } from './src/db';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoAqui';

const options = {
  jwtFromRequest: (req: Request) => {
    const token = req.cookies?.access_token;
    return token || null;
  },
  secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const userResult = await db.select().from(usersTable).where(eq(usersTable.id, jwt_payload.id));

    if (userResult.length === 0) {
      return done(null, false);
    }

    return done(null, userResult[0]);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;
