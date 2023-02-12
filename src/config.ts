// WARNING: only used by support file

export default {
  DS_API_KEY:
    Cypress.env('deploysentinel_key') ?? Cypress.env('DEPLOYSENTINEL_KEY'),
  UPLOAD_ON_PASSES: Boolean(
    Cypress.env('DEPLOYSENTINEL_UPLOAD_ON_PASSES') ??
      Cypress.env('deploysentinel_upload_on_passes') ??
      // Deprecated
      Cypress.env('deploysentinel_force_log_url') ??
      Cypress.env('DEPLOYSENTINEL_FORCE_LOG_URL'),
  ),
  SPEC:
    Cypress.env('deploysentinel_spec') ?? Cypress.env('DEPLOYSENTINEL_SPEC'),
  LOG_VERBOSE: Cypress.env('DEPLOYSENTINEL_LOG_VERBOSE'),
  API_BASE_URL:
    Cypress.env('DEPLOYSENTINEL_API_URL') ??
    'https://api.deploysentinel.com/ci',
};
