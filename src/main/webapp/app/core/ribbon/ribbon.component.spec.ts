import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Ribbon from './ribbon.vue';

import { type AccountStore, useStore } from '@/store';

type RibbonComponentType = InstanceType<typeof Ribbon>;

const pinia = createTestingPinia({ stubActions: false });

describe('Ribbon', () => {
  let ribbon: RibbonComponentType;
  let store: AccountStore;

  beforeEach(async () => {
    const wrapper = shallowMount(Ribbon, {
      global: {
        plugins: [pinia],
      },
    });
    ribbon = wrapper.vm;
    await ribbon.$nextTick();
    store = useStore();
    store.setRibbonOnProfiles(null);
  });

  it('should not have ribbonEnabled when no data', () => {
    expect(ribbon.ribbonEnabled).toBeFalsy();
  });

  it('should have ribbonEnabled set to value in store', async () => {
    const profile = 'dev';
    store.setActiveProfiles(['foo', profile, 'bar']);
    store.setRibbonOnProfiles(profile);
    expect(ribbon.ribbonEnabled).toBeTruthy();
  });

  it('should not have ribbonEnabled when profile not activated', async () => {
    const profile = 'dev';
    store.setActiveProfiles(['foo', 'bar']);
    store.setRibbonOnProfiles(profile);
    expect(ribbon.ribbonEnabled).toBeFalsy();
  });
});
