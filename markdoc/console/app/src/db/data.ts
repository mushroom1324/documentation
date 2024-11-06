export const dbData = {
  allowlist: {
    prefsById: {
      color: {
        id: 'color',
        display_name: 'Color',
        description: 'DO NOT USE, testing purposes only.'
      },
      item: {
        id: 'item',
        display_name: 'Item',
        description: 'DO NOT USE, testing purposes only.'
      },
      postgres_version: {
        id: 'postgres_version',
        display_name: 'Postgres version',
        description:
          'Any Postgres version regardless of its granularity, such as 15, 9.1.2, or ~10.0.0.'
      },
      agent_version: {
        id: 'agent_version',
        display_name: 'Agent version',
        description:
          'Any Agent version regardless of its granularity, such as 7, 6.32.1, or ~7.0.0.'
      },
      agent_host: {
        id: 'agent_host',
        display_name: 'Agent host'
      },
      host: {
        id: 'host',
        display_name: 'Host',
        description:
          'Hosting platform, such as AWS or GCP. Can also refer to containers like Kubernetes.'
      },
      host_type: {
        id: 'host_type',
        display_name: 'Host type',
        description:
          'The machine or container type within a given host, such as EC2. Use only as a followup to a `host` selection.'
      },
      prog_lang: {
        id: 'prog_lang',
        display_name: 'Language',
        description: 'Programming language, such as Python.'
      },
      os: {
        id: 'os',
        display_name: 'OS',
        description:
          'Env operating system, such as Linux. Can refer to a mobile OS, but `mobile_os` is preferred for lists of mobile-only options.'
      },
      database: {
        id: 'database',
        display_name: 'Database'
      },
      mobile_os: {
        id: 'mobile_os',
        display_name: 'OS',
        description: 'Mobile operating system, such as Android.'
      },
      pkg_mgr: {
        id: 'pkg_mgr',
        display_name: 'Package manager',
        description: 'Software package manager, such as npm.'
      }
    }
  }
};
