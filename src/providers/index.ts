import { IJournalProvider } from './provider.interface';
import { MockProvider } from './mock.provider';

/**
 * Provider factory - creates the appropriate provider based on config
 */
export function createProvider(mode: string = 'mock'): IJournalProvider {
    switch (mode.toLowerCase()) {
        case 'mock':
            return new MockProvider();
        // Future providers can be added here:
        // case 'arxiv':
        //   return new ArxivProvider();
        default:
            console.warn(`Unknown provider mode: ${mode}, defaulting to mock`);
            return new MockProvider();
    }
}

export * from './provider.interface';
export * from './mock.provider';

