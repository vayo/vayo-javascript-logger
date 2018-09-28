const DEFAULT_SENSITIVE_DATA_FRAGMENTS = '(mdp|password|authorization|token|pwd|auth)';

module.exports = class SensitiveDataStream {
    // Replaced values for certain keys in the log message, according to the specified pattern
    constructor(fragments) {
        this.fragments = fragments || DEFAULT_SENSITIVE_DATA_FRAGMENTS;
        this.pattern = new RegExp(`"${this.fragments}":"([^"]*)"`, 'ig');
    }

    write(input) {
        const sanitized = input.replace(this.pattern, '"$1":"__REDACTED__"');
        return process.stdout.write(sanitized);
    }
};