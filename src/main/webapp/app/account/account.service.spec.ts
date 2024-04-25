import axios from 'axios';
import sinon from 'sinon';

import { createTestingPinia } from '@pinia/testing';
import AccountService from './account.service';
import { type AccountStore, useStore } from '@/store';

const resetStore = (store: AccountStore) => {
  store.$reset();
};

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

createTestingPinia({ stubActions: false });
const store = useStore();

describe('Account Service test suite', () => {
  let accountService: AccountService;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jhi-authenticationToken', 'token');

    axiosStub.get.reset();
    resetStore(store);
  });

  it('should init service and do not retrieve account', async () => {
    axiosStub.get.resolves({});
    axiosStub.get
      .withArgs('management/info')
      .resolves({ status: 200, data: { 'display-ribbon-on-profiles': 'dev', activeProfiles: ['dev', 'test'] } });

    accountService = new AccountService(store);
    await accountService.update();

    expect(store.logon).toBe(null);
    expect(accountService.authenticated).toBe(false);
    expect(store.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
    expect(store.activeProfiles[0]).toBe('dev');
    expect(store.activeProfiles[1]).toBe('test');
    expect(store.ribbonOnProfiles).toBe('dev');
  });

  it('should init service and retrieve profiles if already logged in before but no account found', async () => {
    axiosStub.get.resolves({});
    accountService = new AccountService(store);
    await accountService.update();

    expect(store.logon).toBe(null);
    expect(accountService.authenticated).toBe(false);
    expect(store.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
  });

  it('should init service and retrieve profiles if already logged in before but exception occurred and should be logged out', async () => {
    axiosStub.get.resolves({});
    axiosStub.get.withArgs('api/account').rejects();
    accountService = new AccountService(store);
    await accountService.update();

    expect(accountService.authenticated).toBe(false);
    expect(store.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
  });

  it('should init service and check for authority after retrieving account but getAccount failed', async () => {
    axiosStub.get.rejects();
    accountService = new AccountService(store);
    await accountService.update();

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(false);
    });
  });

  it('should init service and check for authority after retrieving account', async () => {
    axiosStub.get.resolves({ status: 200, data: { authorities: ['USER'], langKey: 'en', login: 'ADMIN' } });
    accountService = new AccountService(store);
    await accountService.update();

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(true);
    });
  });

  it('should init service as not authentified and not return any authorities admin and not retrieve account', async () => {
    axiosStub.get.rejects();
    accountService = new AccountService(store);
    await accountService.update();

    return accountService.hasAnyAuthorityAndCheckAuth('ADMIN').then((value: boolean) => {
      expect(value).toBe(false);
    });
  });

  it('should init service as not authentified and return authority user', async () => {
    axiosStub.get.rejects();
    accountService = new AccountService(store);
    await accountService.update();

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(false);
    });
  });
});
