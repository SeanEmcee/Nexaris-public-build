/* Rap Box MT for Chute — safe native URL-test trigger, v1.
 * Public script: no credentials or user identifiers.
 * Chute does the actual probe and selection inside its existing VPN engine.
 * This is not compare-and-swap or seamless connection migration.
 */
(function () {
  "use strict";
  var GROUP = "RapSmartAuto";
  function done() { $done({}); }
  try {
    var payload = $klne.getPolicyGroups();
    var groups = payload && payload.policyGroups || [];
    var target = null;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].name === GROUP) { target = groups[i]; break; }
    }
    if (!target || target.type !== 1) {
      console.warn("[Rap Box] Auto-test group missing or not url-test; no action");
      done(); return;
    }
    var policies = target.policyNames || [];
    if (policies.length < 3 || policies.length > 5 ||
        policies.indexOf("DIRECT") !== -1 || policies.indexOf("REJECT") !== -1) {
      console.warn("[Rap Box] Require 3-5 real routes, not DIRECT/REJECT");
      done(); return;
    }
    $klne.startURLTest(GROUP);
    console.log("[Rap Box] Requested Chute-native concurrent candidate testing");
  } catch (e) {
    console.warn("[Rap Box] No Chute test started: " + String(e));
  }
  done();
})();