import { mount } from '@vue/test-utils';
import GeoJSONGenerator from '@/components/GeoJSONGenerator.vue';

describe('GeoJSONGenerator', () => {
  test('returns correct GeoJSON object for first shape', () => {
    const firstShapeCalls = [
      { direction: 'N', degrees: 90, minutes: 0, seconds: 0, cardinal: 'W', distance: 889.46, unit: 'feet' },
      { direction: 'S', degrees: 0, minutes: 0, seconds: 0, cardinal: 'W', distance: 301.14, unit: 'feet' },
      { direction: 'N', degrees: 73, minutes: 54, seconds: 7, cardinal: 'E', distance: 81.99, unit: 'feet' },
      { direction: 'N', degrees: 76, minutes: 0, seconds: 43, cardinal: 'E', distance: 309.74, unit: 'feet' },
      { direction: 'N', degrees: 75, minutes: 39, seconds: 31, cardinal: 'E', distance: 151.29, unit: 'feet' },
      { direction: 'N', degrees: 65, minutes: 27, seconds: 2, cardinal: 'E', distance: 399.69, unit: 'feet' },
    ];

    const wrapper = mount(GeoJSONGenerator, {
      propsData: { calls: firstShapeCalls }
    });

    const expectedGeoJSONFirstShape = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-94.121577724154, 32.71180328837194],
            [-94.1244754292016, 32.71180325505353],
            [-94.1244754292016, 32.71262871962076],
            [-94.1242187913038, 32.71269103723334],
            [-94.12323962366354, 32.712896262639184],
            [-94.12276210039394, 32.71299898394524],
            [-94.12157766605375, 32.71345417777433],
            [-94.121577724154, 32.71180328837194],
          ],
        ],
      },
      properties: {}
    };

    expect(wrapper.vm.geoJsonOutput).toEqual(expectedGeoJSONFirstShape);
  });

  test('returns correct GeoJSON object for square shape', () => {
    const squareShapeCalls = [
      { direction: 'N', degrees: 0, minutes: 0, seconds: 0, cardinal: 'E', distance: 1000, unit: 'kilometers' },
      { direction: 'N', degrees: 90, minutes: 0, seconds: 0, cardinal: 'W', distance: 1000, unit: 'kilometers' },
      { direction: 'S', degrees: 0, minutes: 0, seconds: 0, cardinal: 'W', distance: 1000, unit: 'kilometers' },
      { direction: 'S', degrees: 90, minutes: 0, seconds: 0, cardinal: 'E', distance: 1000, unit: 'kilometers' },
    ];

    const wrapper = mount(GeoJSONGenerator, {
      propsData: { calls: squareShapeCalls }
    });

    const expectedGeoJSONSquareShape = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-94.121577724154, 32.71180328837194],
            [-94.121577724154, 34.060785697250026],
            [-92.49338226937344, 34.05005091451823],
            [-92.49338226937344, 32.70106850564014],
            [-94.09632767701014, 32.69087414001817],
            [-94.121577724154, 32.71180328837194]
          ]
        ],
      },
      properties: {}
    };

    expect(wrapper.vm.geoJsonOutput).toEqual(expectedGeoJSONSquareShape);
  });

  test('handles edge case where the direction and distance result in the same starting and ending points', () => {
    const sameStartEndCalls = [
      { direction: 'N', degrees: 0, minutes: 0, seconds: 0, cardinal: 'E', distance: 0, unit: 'meters' }
    ];

    const wrapper = mount(GeoJSONGenerator, {
      propsData: { calls: sameStartEndCalls }
    });

    const expectedGeoJSONSameStartEnd = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-94.121577724154, 32.71180328837194],
            [-94.121577724154, 32.71180328837194],
            [-94.121577724154, 32.71180328837194]
          ]
        ],
      },
      properties: {}
    };

    expect(wrapper.vm.geoJsonOutput).toEqual(expectedGeoJSONSameStartEnd);
  });

  test('parses and handles direction and distance calls correctly', () => {
    const directionDistanceCalls = [
      { direction: 'N', degrees: 90, minutes: 0, seconds: 0, cardinal: 'E', distance: 300, unit: 'meters' },
      { direction: 'N', degrees: 90, minutes: 0, seconds: 0, cardinal: 'W', distance: 300, unit: 'meters' }
    ];

    const wrapper = mount(GeoJSONGenerator, {
      propsData: { calls: directionDistanceCalls }
    });

    const expectedGeoJSONTest = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-94.121577724154, 32.71180328837194],
            [-94.11837120345932, 32.71180324757346],
            [-94.12157772415254, 32.711803206774974],
            [-94.121577724154, 32.71180328837194]
          ]
        ],
      },
      properties: {}
    };

    expect(wrapper.vm.geoJsonOutput).toEqual(expectedGeoJSONTest);
  });
});
