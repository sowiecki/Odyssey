//= require components

describe('RouteSegments', function() {
	var routeSegements = new RouteSegments;
  it("has correct default properties", function() {
    expect(routeSegements.bikeId).toBe(null);
    expect(routeSegements.offset).toBe(null);
    expect(routeSegements.waypts).toBe([]);
    expect(routeSegements.wayptsInfo).toBe([]);
    expect(routeSegements.speedInterval).toBe(1400);
  });
});