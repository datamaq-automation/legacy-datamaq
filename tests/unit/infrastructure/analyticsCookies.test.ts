import { beforeEach, describe, expect, it } from 'vitest'
import { clearAnalyticsCookies } from '@/infrastructure/analytics/cookies'

describe('analytics cookies hard revoke', () => {
  beforeEach(() => {
    document.cookie = '_ga=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie = '_ga_TEST=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie = '_clck=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie = 'non_analytics=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  })

  it('removes ga4 and clarity cookies while preserving non-analytics cookies', () => {
    document.cookie = '_ga=ga_cookie;path=/'
    document.cookie = '_ga_TEST=ga_cookie_prefix;path=/'
    document.cookie = '_clck=clarity_cookie;path=/'
    document.cookie = 'non_analytics=keep_me;path=/'

    clearAnalyticsCookies()

    expect(document.cookie).not.toContain('_ga=')
    expect(document.cookie).not.toContain('_ga_TEST=')
    expect(document.cookie).not.toContain('_clck=')
    expect(document.cookie).toContain('non_analytics=keep_me')
  })
})
