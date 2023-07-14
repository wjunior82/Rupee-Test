export interface Body {
    path: string;
    data: string;
    title: string;
    shortDescription: string;
  }
  
  export type Event = {
    Records: Array<{
      messageId: string;
      body: string;
    }>;
  };