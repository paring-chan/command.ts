/*
  Command.TS decorator metadata keys.
 */

/**
 * Key Prefix
 */
export const CLASSIFIER = 'CommandTS:'

/**
 * Metadata Key to store commands data
 */
export const COMMANDS_KEY = CLASSIFIER + 'commands'
/**
 * Metadata key to store slash commands data
 */
export const SLASH_COMMANDS_KEY = CLASSIFIER + 'slash_commands'
/**
 * Metadata key to store listeners data
 */
export const LISTENERS_KEY = CLASSIFIER + 'listeners'
/**
 * Metadata key to store argument converters data
 */
export const ARG_CONVERTER_KEY = CLASSIFIER + 'arg_converters'

/**
 * Metadata key to store owner-only data
 */
export const COMMANDS_OWNER_ONLY_KEY = CLASSIFIER + 'owner_only_keys'
/**
 * Metadata key to store whether the argument is optional
 */
export const COMMANDS_OPTIONAL_KEY = CLASSIFIER + 'optional'
/**
 * Metadata key to store whether the argument gets the rest of arguments.
 */
export const COMMANDS_REST_KEY = CLASSIFIER + 'rest'
/**
 * Metadata key to store command checks data
 */
export const COMMANDS_CHECK_KEY = CLASSIFIER + 'checks'

export const COMMANDS_USER_PERMISSIONS_KEY = CLASSIFIER + 'userPermissions'
export const COMMANDS_CLIENT_PERMISSIONS_KEY = CLASSIFIER + 'clientPermissions'
