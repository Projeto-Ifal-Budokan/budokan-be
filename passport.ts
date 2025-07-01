import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { eq, inArray } from 'drizzle-orm';
import { usersTable } from './src/db/schema/user-schemas/users';
import { db } from './src/db';
import { Request } from 'express';
import type { User, Role, Privilege } from './src/types/auth.types';
import { rolesTable } from './src/db/schema/user-schemas/roles';
import { userRolesTable } from './src/db/schema/user-schemas/user-roles';
import { privilegesTable } from './src/db/schema/user-schemas/privileges';
import { rolePrivilegesTable } from './src/db/schema/user-schemas/role-privileges';

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
    // Buscar dados básicos do usuário
    const userResult = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      surname: usersTable.surname,
			status: usersTable.status,
			birthDate: usersTable.birthDate,
			phone: usersTable.phone,
			profileImageUrl: usersTable.profileImageUrl,
			createdAt: usersTable.createdAt,
			updatedAt: usersTable.updatedAt,
		})
			.from(usersTable)
			.where(eq(usersTable.id, jwt_payload.id));

    if (userResult.length === 0) {
      return done(null, false);
    }

    const user: User = {
      ...userResult[0],
      updatedAt: userResult[0].updatedAt || userResult[0].createdAt
    };
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;
