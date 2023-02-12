import type { Protocol } from 'devtools-protocol/types/protocol';

export type RuntimeMetrics = {
  os: {
    freemem: number;
    totalmem: number;
  };
  nodeProcess: {
    totalHeapSize: number;
    usedHeapSize: number;
  };
  browser: {
    jsHeapUsedSize?: number;
    jsHeapTotalSize?: number;
  };
};

export type NetworkMocksFilter = {
  includeUrls: string[];
  excludeUrls: string[];
};

export type APIClientConfig = {
  apiKey: string;
  baseUrl: string;
  buildId: string | undefined;
  getRuntimeMetrics: () => Promise<RuntimeMetrics> | null;
  verbose?: boolean;
};

export type TestConfig = {
  cypressVersion: string;
  defaultCommandTimeout: number | undefined;
  group?: string;
  pageLoadTimeout: number | undefined;
  parallel: boolean | undefined;
  projectId: string | null;
  reporter: string | undefined;
  reporterOptions: unknown;
  requestTimeout: number | undefined;
  resolvedNodeVersion: string | undefined;
  responseTimeout: number | undefined;
  tag?: string;
  taskTimeout: number | undefined;
  video: boolean | undefined;
  videoUploadOnPasses: boolean | undefined;
  browser: {
    isHeadless: boolean | undefined;
    name: string | undefined;
    version: string | undefined;
  };
  system: {
    osName: string;
    osVersion: string;
  };
};

export type LoggerMessage = {
  message: string | Error;
  location: string;
  meta?: { [key: string]: unknown };
};

export enum LoggerSeverity {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export type DeploySentienlEventType =
  | 'browserLogEntry'
  | 'console'
  | 'custom'
  | 'dom'
  | 'exception'
  | 'hook'
  | 'log'
  | 'network';

export type DSEventError = {
  message: string;
};

type DSNetworkRequestEventPayload = {
  referrerPolicy: string;
  id: string;
  timestamp: number;
  url: string;
  headers: { [key: string]: string };
  method: string;
  type:
    | 'Document'
    | 'Stylesheet'
    | 'Image'
    | 'Media'
    | 'Font'
    | 'Script'
    | 'TextTrack'
    | 'XHR'
    | 'Fetch'
    | 'EventSource'
    | 'WebSocket'
    | 'Manifest'
    | 'SignedExchange'
    | 'Ping'
    | 'CSPViolationReport'
    | 'Preflight'
    | 'Other';
};
type DSNetworkResponseEventPayload = {
  connectionReused: boolean;
  encodedDataLength: number;
  fromDiskCache: boolean;
  fromPrefetchCache: boolean;
  fromServiceWorker: boolean;
  headers: { [key: string]: string };
  mimeType: string;
  protocol: string;
  remoteIPAddress: string;
  remotePort: number;
  statusCode: number;
  statusMessage: string; // 'OK'
  timestamp: number;
  timing: {
    // A lot of these can be -1, not sure why?
    requestTime: number;
    proxyStart: number;
    proxyEnd: number;
    dnsStart: number;
    dnsEnd: number;
    connectStart: number;
    connectEnd: number;
    sslStart: number;
    sslEnd: number;
    workerStart: number;
    workerReady: number;
    workerFetchStart: number;
    workerRespondWithSettled: number;
    sendStart: number;
    sendEnd: number;
    pushStart: number;
    pushEnd: number;
    receiveHeadersEnd: number;
  };
  type: string;
  bodySize: number;
  base64Encoded: boolean;
  body: string;
};

type DSNetworkEventPayload = {
  type: 'network';
  data: {
    requestServedFromCache: boolean;
    loadingFailed?: {
      canceled: boolean;
      errorText: string; //"net::ERR_ABORTED"
      timestamp: number;
      type: string; // "Fetch"
    };
    req: DSNetworkRequestEventPayload;
    res?: DSNetworkResponseEventPayload;
  };
  id: string;
  offset: number;
  took?: number;
  ts: number;
};
export type DSEvent =
  | {
      data: any;
      id: string;
      offset: number;
      took?: number;
      ts: number;
      type: Exclude<Exclude<DeploySentienlEventType, 'network'>, 'log'>;
    }
  | {
      type: 'log';
      id: string;
      offset: number;
      took?: number;
      ts: number;
      data: {
        beforeDomEventId: string;
        beforeDomRrwebNodeIds: number[];
        afterDomEventId: string;
        afterDomRrwebNodeIds: number[];
        windowLocation: string;
        id: string;
        chainerId: string;
        err?: {
          message: string;
          name: string;
          stack: string;
          parsedStack: any[];
        };
        type: 'parent' | string; // 'parent'
        displayName?: 'fetch' | string;
        hookId?: string;
        wallClockStartedAt: string;
        renderProps: any;
        consoleProps: any;
        url: string;
        name: string;
        message: string;
        event: boolean;
        ended: boolean;
        state: 'failed' | string; // 'failed'
      };
    }
  | DSNetworkEventPayload;

export type DSRun = {
  _id: string;
  s3PresignedUrls: {
    backendLogs: string | null;
    browser: string | null;
    internal: string | null;
    plugin: string | null;
    screenshot: string | null;
  };
};

export type DSNetworkMockEvent = {
  body: unknown;
  cacheLookupKey?: string;
  method: string;
  response: unknown;
  status: number;
  type: string;
  url: string;
};

export type RunsMapValue = {
  backendLogsPresignedUrl: string | null;
  completedAt?: number;
  retryNumber: number;
  spec: string;
  startedAt: number;
  suiteTitles: string[];
};

export type RunPayload = {
  ciProvider: string | null;
  code: string;
  commitInfo?: CommitInfo;
  name: string;
  retries: number;
  retryNumber: number;
  startedAt: Date;
  testName: string;
};

export type PatchRunPayload = {
  batchId: string;
  ciProvider?: string;
  completedAt: Date;
  took: number;
  state: string;
  errorTrace?: {
    message: string;
    name: string;
    codeFrame: string;
    stack: string;
    sourceMappedStack: string;
  };
  networkTimings?: { [url: string]: number[] } | null;
};

// This type is public facing!!
export type DSNetworkEvent = {
  // TODO: DEPRECATE ----------------------
  /** @deprecated use request.url instead */
  url?: string;
  /** @deprecated use request.method instead */
  method?: string;
  /** @deprecated use request.headers instead */
  headers?: { [key: string]: string };
  // ---------------------------------------
  request: {
    url: string;
    method: string;
    headers: { [key: string]: string };
  };
  response?: {
    headers: { [key: string]: string };
    statusCode: number;
    statusMessage: string; // 'OK'
    bodySize: number;
    body: string;
  };
};

export enum NetworkMockMode {
  Record = 'record',
  Intercept = 'intercept',
}

export type DebuggerOptions = {
  networkMock?: {
    clearMocks?: boolean;
    excludeUrls?: string[];
    includeUrls?: string[];
    methods?: ('GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD')[];
    mode: NetworkMockMode;
    resourceTypes?: Protocol.Network.ResourceType[];
  };
  beforeNetworkSend?: (
    event: DSNetworkEvent,
  ) => DSNetworkEvent | null | undefined;
};

export enum CypressRunState {
  Failed = 'failed',
  Passed = 'passed',
  Pending = 'pending',
  Skipped = 'skipped',
}

export type CypressError = {
  message: string;
  name: string;
  codeFrame: {
    absoluteFile: string;
    column: number;
    frame: string;
    language: string;
    line: number;
    originalFile: string;
    relativeFile: string;
  };
  stack: string;
  sourceMappedStack: string;
};

export type CommandLog = {
  alias?: string;
  id: string;
  name: string; // viewport, get, click, request, page load, form sub, etc.
  message: string;
  event: boolean; // bool
  ended: boolean; // bool
  state: 'passed' | 'failed' | 'pending';
  chainerId: string; // string of the Cypress chain this action is
  wallClockStartedAt: Date; // ex. "2022-04-24T21:28:17.213Z"
  type: string; // parent, child
  err?: CypressError;

  $el?: JQuery<HTMLElement>;

  renderProps: {
    indicator?: string;
    message?: string;
  };

  // Get
  numElements?: number; // Number of elements matching get
  highlightAttr?: string; // Usually "data-cypress-el"

  // Hook
  hookId: string;

  // Network
  displayName: string; // Network resource type (ex. script)
  method: 'GET' | 'POST'; // GET, POST
  // this object can be nested
  consoleProps: {
    Command: string;
    Elements?: number;
    Error?: string;
    Method?: string;
    Selector?: string;
    URL?: string;
    Yielded?: unknown;
    // cy.request
    Request?: {
      'Request Body'?: unknown;
      'Request Headers': Record<string, string>;
      'Request URL': string;
      'Response Body'?: string;
      'Response Headers'?: Record<string, string>;
      'Response Status'?: number;
    };
  };
  url: string;

  // Assertions
  passed?: boolean; // Assertion passed, bool
  actual?: boolean;
  expected?: boolean;
};

export type CypressTest = {
  id: string;
  type: 'test';
  body: string;
  _retries: number;
  _currentRetry: number;
  title: string;
  wallClockStartedAt: Date;
  wallClockDuration: number;
  state: CypressRunState;
  err?: CypressError;
  invocationDetails?: {
    relativeFile: string;
  };
  parent: CypressSuite;
};

export type CypressSuite = {
  id: string;
  title: string;
  type: 'suite';
  parent: CypressSuite;
};

export type CommitInfo = {
  authorEmail: string | null;
  authorName: string | null;
  branch: string | null;
  ciBuildId: string | null;
  defaultBranch: string | null;
  message: string | null;
  remoteBranch: string | null;
  remoteOrigin: string | null;
  sha: string | null;
  timestamp: number | null;
  metadata: unknown | null;
};

export enum Task {
  ClearMocks = 'DeploySentinelTaskClearMocks',
  ClearTestLocalCache = 'DeploySentinelTaskClearTestLocalCache',
  CompleteRun = 'DeploySentinelTaskCompleteRun',
  CreateRun = 'DeploySentinelTaskCreateRun',
  Debug = 'DeploySentinelTaskDebug', // internal use only
  GetBrowserArtifactsPresignedUrl = 'DeploySentinelTaskGetBrowserArtifactsPresignedUrl',
  LogRunUrl = 'DeploySentinelTaskLogRunUrl',
  PushPluginEvent = 'DeploySentinelTaskPushPluginEvent',
  ReadMockFile = 'DeploySentinelTaskReadMockFile',
  RecordMocks = 'DeploySentinelTaskRecordMocks',
  SendMessage = 'DeploySentinelTaskSendMessage',
  StartCRI = 'DeploySentinelTaskStartCRI',
  StopCRI = 'DeploySentinelTaskStopCRI',
  SupportFileIsDetected = 'DeploySentinelTaskSupportFileIsDetected',
  UploadBrowserArtifacts = 'DeploySentinelTaskUploadBrowserArtifacts',
  UploadPluginArtifacts = 'DeploySentinelTaskUploadPluginArtifacts',
  WriteMocksToFile = 'DeploySentinelTaskWriteMocksToFile',
}

export type JunitReporterOptions = {
  jenkinsMode?: boolean; // flips testCaseSwitchClassnameAndName
  mochaFile?: string;
  suiteTitleSeparatedBy?: string;
  testCaseSwitchClassnameAndName?: boolean;
};
