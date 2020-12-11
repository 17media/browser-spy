import { History } from "history";
import { RefObject } from "react";
interface BaseEvent<Payload> {
    type: "tracking";
    category: string;
    action: string;
    name: string;
    payload: Payload;
    $$type: "TrackingEvent";
}
// auto injection
interface BasePayload {
    //如果是訪客打 "guest"
    userId?: string;
    lang?: string;
    os?: string;
    eventId?: string;
    timestamp?: string;
    codename?: string;
    guestSessionId?: string;
}
interface ClickButtonEventPayload extends BasePayload {
    action: "ButtonClick";
    name: string;
}
interface ClickButtonEvent extends BaseEvent<ClickButtonEventPayload> {
    category: "PageSurfing";
    action: "click";
}
interface ClickTabEventPayload extends BasePayload {
    action: "ButtonClick";
    name: string;
    // url
    page: string;
}
interface ClickTabEvent extends BaseEvent<ClickTabEventPayload> {
    category: "PageSurfing";
    action: "click";
}
interface ClickLeaderboardButtonEventPayload extends BasePayload {
    action: "ButtonClick";
    name: string;
    // bonus, contributor, vote
    type: string;
}
interface ClickLeaderboardButtonEvent extends BaseEvent<ClickLeaderboardButtonEventPayload> {
    category: "PageSurfing";
    action: "click";
    name: "button_expend.open" | "button_expend.close" | "button_vote";
}
interface ClickTopStreamerEventPayload extends BasePayload {
    action: "ProfileClick";
    leaderboardId: string;
    streamerId: string;
    type: "topavatar";
    liveStatus: boolean;
    // 如果有勾選“Open 17 app when clicking avatar if enable.”則為true,反之則為false
    hasDeeplink: boolean;
}
interface ClickTopStreamerEvent extends BaseEvent<ClickTopStreamerEventPayload> {
    // 直撥中 = LiveStream, 非直撥中 = Profile
    category: "LiveStream" | "Profile";
    action: "click";
    name: "avatar_top";
}
interface ClickStreamerEventPayload extends BasePayload {
    action: "ProfileClick";
    leaderboardId: string;
    streamerId: string;
    type: "avatar";
    liveStatus: boolean;
    // 如果有勾選“Open 17 app when clicking avatar if enable.”則為true,反之則為false
    hasDeeplink: boolean;
}
interface ClickStreamerEvent extends BaseEvent<ClickStreamerEventPayload> {
    // 直撥中 = LiveStream, 非直撥中 = Profile
    category: "LiveStream" | "Profile";
    action: "click";
    name: "avatar_streamer";
}
interface LinkEventPayload extends BasePayload {
    action: "LinkClick";
    url: string;
    //超連結字名稱
    name: string;
}
interface LinkEvent extends BaseEvent<LinkEventPayload> {
    category: "PageSurfing";
    action: "click";
    name: "link_info";
}
interface PageViewEventPayload extends BasePayload {
    leaderboardStartTime: number;
    leaderboardEndTime: number;
    // url
    from: string;
    // url
    to: string;
    utmCampaign: string;
    utmContent: string;
    utmMedium: string;
    utmSource: string;
}
interface PageViewEvent extends BaseEvent<PageViewEventPayload> {
    category: "Leaderboard" | "Infomation";
    action: "view";
    name: "event_view";
}
interface SectionViewEventPayload extends BasePayload {
    section: string;
    action: "enter" | "leave";
    //滑榜單停下時,打看到的最後一個名次
    rank?: number;
    // 提供給客製活動使用(因為url不會轉換)
    customPath?: string;
}
interface SectionViewEvent extends BaseEvent<SectionViewEventPayload> {
    category: "PageSurfing";
    action: "scroll";
}
interface SearchUserEventPayload extends BasePayload {
    searchString: string;
    resultCount: number;
}
interface SearchUserEvent extends BaseEvent<SearchUserEventPayload> {
    category: "Content";
    action: "search";
    name: "search_user";
}
type TrackingEvent = ClickButtonEvent | ClickTabEvent | ClickLeaderboardButtonEvent | ClickTopStreamerEvent | ClickStreamerEvent | LinkEvent | PageViewEvent | SectionViewEvent | SearchUserEvent;
type V2TrackingEvent = TrackingEvent;
declare enum Threshold {
    "MIN" = 0,
    "HALF" = 0.5,
    "FULL" = 1
}
interface Scene {
    title: string;
    hostname: string;
    pathname: string;
}
interface TransitionEvent {
    type: "transition";
    fromScene: Scene;
    toScene: Scene;
    defaultTrackingParams: DefaultEventParams;
}
interface TrackingToken {
    sessionID: string;
    date: number;
}
interface TrackingEventParams {
    userId?: string;
    lang?: string;
    os?: string;
    eventId?: string;
    timestamp?: number;
    action?: string;
    name?: string;
    role?: string;
    value?: string;
    page?: string;
    type?: string;
    leaderboardId?: string;
    streamerId?: string;
    liveStatus?: boolean;
    section?: string;
    rank?: number;
    to?: string;
    url?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmMedium?: string;
    utmSource?: string;
    searchString?: string;
    resultCount?: number;
    hasDeeplink?: boolean;
    codename?: string;
    productName?: string;
    userName?: string;
    from?: string;
    result?: string;
    duration?: number;
    customPath?: string;
}
interface TrackingEvent$0 {
    type: "tracking";
    category: string;
    eventName: string;
    action?: string;
    trackingParams?: TrackingEventParams;
}
interface DefaultEventParams {
    userId: string;
    lang: string;
    os: string;
    eventId: string;
    timestamp: number;
    codename: string;
    guestSessionId: string;
}
interface LoginEvent {
    type: "login";
    userId: string;
}
interface RefinedEventPathname {
    eventId: string;
    codename: string;
}
type ElementMap = Map<Element, Function>;
type SpyEvent = TrackingEvent$0 | TransitionEvent | LoginEvent | V2TrackingEvent;
type EventCallback<T> = (event: T) => void;
type EventListener<T> = (callback: EventCallback<T>) => void;
declare enum AgentState {
    Uninitialized = 0,
    Initializing = 1,
    Initialized = 2,
    InitializeFail = 3
}
declare abstract class Agent {
    protected state: AgentState;
    initialize(): Promise<void>;
    abstract report(event: SpyEvent): void;
    protected abstract doInitialize(): Promise<void> | void;
}
declare class FirebaseAgent extends Agent {
    readonly config: any;
    private client;
    private queue;
    /**
     * @param config @see https://support.google.com/firebase/answer/7015592
     */
    constructor(config: any);
    doInitialize(): Promise<void>;
    report(event: SpyEvent): void;
    private doReport;
    private login;
    private transit;
    private track;
    private queueIfNotInitialized;
}
interface MatomoAgentConfig {
    endpoint: string;
    siteId: string;
}
declare class MatomoAgent extends Agent {
    readonly config: MatomoAgentConfig;
    private get client();
    private trackPageViewTimer;
    constructor(config: MatomoAgentConfig);
    doInitialize(): Promise<void>;
    report(event: SpyEvent): void;
    private login;
    private transit;
    private track;
    private requestTrackPageView;
}
type V2TrackingEvent = TrackingEvent$0;
interface Source {
    addAgent(agent: Agent): void;
}
declare class DefaultSource implements Source {
    private agents;
    private currentScene;
    addAgent(agent: Agent): void;
    spyTransition(history: History): void;
    spyClick(): void;
    // tracking page visibility. e.g. page minimized, change browser tab or page unload
    spyPageDurationByVisible(params?: TrackingEventParams): void;
    spyPageDurationByTransition(history: History, params?: TrackingEventParams): void;
    login(userId: string): void;
    transit(toScene: Scene): void;
    track(event: Omit<TrackingEvent$0, "type"> | V2TrackingEvent): void;
    private report;
}
declare class SectionObserver {
    elementMap: ElementMap;
    private observer;
    private debounceExecute;
    constructor(debounce: boolean, threshold: Threshold);
    sectionObserve(ref: RefObject<any>, callback: Function): void;
    sectionUnobserve(ref: RefObject<any>): void;
    resetSectionObserver(): void;
    private sectionIntersect;
    private debounceSectionIntersect;
}
declare let completeSectionObserver: SectionObserver | undefined;
declare let halfSectionObserver: SectionObserver | undefined;
declare let minSectionObserver: SectionObserver | undefined;
declare let rankSectionObserver: SectionObserver | undefined;
declare function registCompleteSectionObserver(ref: RefObject<any>, callback: Function): () => void;
declare function registHalfSectionObserver(ref: RefObject<any>, callback: Function): () => void;
declare function registMinSectionObserver(ref: RefObject<any>, callback: Function): () => void;
declare function registRankSectionObserver(ref: RefObject<any>, callback: Function): () => void;
declare function resetSectionObserverStatus(): void;
declare function useCompleteSectionTracking(ref: RefObject<any>, callback: Function): void;
declare function useHalfSectionTracking(ref: RefObject<any>, callback: Function): void;
declare function useMinSectionTracking(ref: RefObject<any>, callback: Function): void;
declare function useRankSectionTracking(ref: RefObject<any>, callback: Function): void;
declare function usePageTransitionListener(trackingSource: DefaultSource, history: History): void;
type EventAction = Omit<TrackingEvent$0, "type">;
type SectionName = "buttons" | "duration" | "gifts" | "searchBar" | "tabs" | "description" | "timeline" | "topStreamer";
type ProfileName = "topavatar" | "avatar";
declare function createButtonClickAction(buttonName: string, link: string): EventAction;
declare function createPageEnterAction(utmCampaign: string, utmContent: string, utmMedium: string, utmSource: string): EventAction;
declare function createPageLeaveAction(): EventAction;
declare function createTabClickAction(link: string, tabName: string): EventAction;
declare function createProfileClickAction(userID: string, liveStatus: boolean, profileType: ProfileName): EventAction;
declare function createSearchAction(keyword: string, count: number): EventAction;
declare function createVoteAction(voteTopic: string): EventAction;
declare function createLeaderboardSectionViewAction(rank: number): EventAction;
declare function createLinkClickAction(link: string, linkName: string): EventAction;
declare function createSectionViewAction(section: SectionName, customPath?: string): EventAction;
type V2TrackingEvent = TrackingEvent$0;
declare function createDefaultEventParams(): DefaultEventParams;
declare function createTrackingEvent(event: Omit<TrackingEvent, "type" | "$$type">): TrackingEvent;
export { Agent, FirebaseAgent, MatomoAgentConfig, MatomoAgent, Source, DefaultSource, completeSectionObserver, halfSectionObserver, minSectionObserver, rankSectionObserver, registCompleteSectionObserver, registHalfSectionObserver, registMinSectionObserver, registRankSectionObserver, resetSectionObserverStatus, Threshold, Scene, TransitionEvent, TrackingToken, TrackingEventParams, TrackingEvent$0 as TrackingEvent, DefaultEventParams, LoginEvent, RefinedEventPathname, ElementMap, SpyEvent, EventCallback, EventListener, useCompleteSectionTracking, useHalfSectionTracking, useMinSectionTracking, useRankSectionTracking, usePageTransitionListener, createButtonClickAction, createPageEnterAction, createPageLeaveAction, createTabClickAction, createProfileClickAction, createSearchAction, createVoteAction, createLeaderboardSectionViewAction, createLinkClickAction, createSectionViewAction, createDefaultEventParams, createTrackingEvent as createV2TrackingEvent };
