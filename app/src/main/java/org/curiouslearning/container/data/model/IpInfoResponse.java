package org.curiouslearning.container.data.model;

/**
 * Response model for the ipinfo.io Lite endpoint (https://api.ipinfo.io/lite/me).
 *
 * Deliberately declares ONLY the country field: Gson discards every other field
 * in the response (ip, asn, continent, ...), so the device IP is never
 * materialized, logged, or persisted (MR-156 AC 2).
 */
public class IpInfoResponse {

    public String country;
}
