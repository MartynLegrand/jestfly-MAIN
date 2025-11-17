
// This file re-exports auth methods from the modular method files
// This provides backward compatibility while using the improved modular implementations

export { loginUser, logoutUser } from './methods/loginMethods';
export { registerUser } from './methods/registrationMethods';
export { resetUserPassword, updateUserPassword } from './methods/passwordMethods';
export { updateUserProfile, fetchUserData } from './methods/profileMethods';
