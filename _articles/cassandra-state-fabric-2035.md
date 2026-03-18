---
layout: article
title: "From Database to State Fabric: Imagining Cassandra in 2035"
date: 2025-11-02
category: Apache Cassandra
reading_time: 13
excerpt: "Ten years from now, developers won't choose a database by brand. They'll choose an API. The question for Cassandra is whether we evolve into the universal state fabric that supports any interface developers need, or whether we stay a specialized product and eventually become legacy infrastructure."
---

Ten years from now, I don't think you'll be choosing a database because of its brand.

I know that sounds strange coming from someone who's spent two decades working inside the Cassandra community. But this shift isn't a threat to Cassandra. It's actually our biggest opening. The question isn't whether this change is coming. It's: do we evolve into the universal state fabric developers need, or do we fossilize into legacy infrastructure?

Here's the evidence, the choice, and what it takes to win.

This is the final post in a four-part series. In [post 1](/articles/great-database-consolidation/) I made the case that database sprawl is ending. In [post 2](/articles/cassandra-winning-consolidation/) I showed why workloads are consolidating onto Cassandra at a 40-to-24 ratio. In [post 3](/articles/cassandra-ai-data-backbone/) I covered why AI infrastructure patterns map directly onto what Cassandra does well. Now let's talk about the decade ahead.

## The Post-Brand Era Is Already Here

Think back to 2010. You picked your database based on what you loved. You were a "MySQL person" or a "MongoDB person." You built expertise in that ecosystem and defended it passionately. The database brand mattered.

That era is ending.

What's replacing it is something more direct: developers want to specify the interface first. Give me SQL. Give me a key-value store. Give me a document model. Give me a graph query interface. The message is: "I don't care which engine sits behind it. I care about the API I'm writing against."

This isn't sentiment. It's measurable.

## Three Trends That Got Us Here

### 1. Proliferation Is Contracting into Consolidation

The 2010s were the Wild West. An explosion of NewSQL, NoSQL, polyglot persistence, every use case getting its own specialized tool. New databases launched every year, peaked in the 2010s, and the rate has been tapering since.

But the important part: database brands are contracting while APIs are consolidating. Developers still need SQL, key-value, document, search, and graph. Those categories aren't going anywhere. What's happening is that a handful of winners per API category are emerging and everyone else is getting absorbed or left behind.

When you stop caring about the brand, you start asking: who does SQL best? Who has the most mature key-value API? Whose document model is the standard? The answers are already clear. PostgreSQL for SQL. Redis and Valkey (RESP protocol) for key-value. MongoDB for document. The Lucene family for search. Graph is still sorting itself out, but SQL and GQL are converging while Gremlin and openCypher are quietly getting left behind.

The [Redgate 2025 State of the Database Landscape report](https://www.red-gate.com/solutions/state-of-database-landscape/2025/) tracks these consolidation patterns across thousands of organizations and shows the same thing: teams are reducing their portfolio of database technologies, not expanding it.

### 2. Object Storage Economics Are Reshaping Architecture

S3 didn't just change how we think about storage. It rewired how databases should be designed.

AWS S3 went from 1 trillion objects in 2012 to over 400 trillion in 2025. Twelve to eighteen percent CAGR through 2030. Meanwhile the price has held at 2.3 cents per gigabyte with eleven-nines durability. Block storage is growing at 17-23%, but for a narrowing set of use cases.

The economics are not subtle. Cold data, and most of your data is cold, should live on object storage. Warm data should tier between it. Hot data lives locally. But most databases haven't made this a first-class design principle. They still treat object storage as a backup destination instead of the primary storage tier.

Cassandra has a real chance to fix this.

### 3. Developers Ask for APIs, Not Brands

This is the shift that changes everything.

The trend toward multi-API support has been underway since 2010. More databases now ship multiple query syntaxes. Developers don't want to learn six different query languages for six different engines. They want one interface they know and trust.

The winners understand this. PostgreSQL isn't just a database anymore. It's becoming the lingua franca, and the number of projects adding PostgreSQL wire protocol compatibility from 2010 through 2025 is remarkable. It happened the same way USB-C adoption happened: everyone complained about it, and then it happened anyway. Standards win.

Developers are saying: give me the endpoint. They want serverless. They want multi-API. They want to write against the abstraction they already understand.

[The 2025 Apache Cassandra community survey](https://cassandra.apache.org/_/blog/2024-User-Survey.html) confirms this from the inside: our own users' top feature requests are about reliability and compatibility, not proprietary new query paradigms. They want the system to work better with the tools they already have.

## The API Winners and What It Means

The winners by category are already settling:

- **SQL**: PostgreSQL. Every database founder secretly wishes they'd built this interface first.
- **Key-Value**: Redis and Valkey (RESP protocol). The market has spoken.
- **Document**: MongoDB API. The standard for flexible schemas.
- **Search**: The Lucene family. Elasticsearch and OpenSearch have won this category.
- **Graph**: SQL and GQL are converging. Everything else is getting left behind.

Notice something? None of these were decided by standards committees. They emerged because developers chose them with their keyboards. And once developers learn PostgreSQL syntax, they expect it everywhere. Once they use RESP, they expect that protocol anywhere they store key-value data.

This is the direction: developers pick the API, and database vendors compete on what's behind it. Who has better distributed transaction guarantees? Who scales furthest? Who keeps the lights on across regions? Those are the competitive questions now, not the query language itself.

## The Choice: Evolve or Fossilize

Every database project faces this question now. Cassandra is in a position of strength that most projects can't match.

We have built what I'd call an alligator-infested moat:

- Availability and fault tolerance that most distributed systems can't approach
- Scalability that people still don't fully believe until they see it in production
- Portability across any cloud, on-premises, or at the edge
- Global distribution that actually works
- Durability guarantees that hold up under real pressure
- The architectural flexibility to serve new workloads without abandoning core strengths

Nobody else built this. We did.

But here's the honest version: if we stay frozen as "the Cassandra database," we'll eventually become legacy infrastructure. The market won't let us be just Cassandra anymore. We need to become the universal state fabric that developers build against, not because it's Cassandra underneath, but because it's the lowest-friction way to store, query, and scale any data shape they throw at us.

We either become the universal state layer, or we become legacy. There's not a third option.

## Four Strategic Moves for the Next Decade

This is not a product roadmap announcement. These are strategic choices that determine whether we're still relevant in 2035.

### Move 1: Deprecate CQL, Adopt SQL

CQL 3.x goes into maintenance mode. Everything new aligns with PostgreSQL syntax and DDL semantics.

I know this is the bold move. Cassandra developers know CQL. We've invested in it. Some people love it. But CQL is a bespoke interface. PostgreSQL is spoken everywhere. If we're competing on API, we need to speak the world's lingua franca.

What this looks like in practice:

- Ship a SQL parser and planner alongside the existing Cassandra execution engine
- Build JDBC and ODBC drivers, the way any production database does
- Pass the PostgreSQL conformance test suite where it makes sense for our architecture
- Ship migration tooling that helps projects move from PostgreSQL or MySQL into Cassandra-as-SQL without rewriting applications
- Make schema DDL feel familiar to anyone who's written `CREATE TABLE` in PostgreSQL

The outcome: your middleware doesn't care whether it's talking to PostgreSQL or Cassandra. Your connection pool works identically. Your ORM generates the same queries. Fewer bespoke tools, faster migrations, lower learning curve.

### Move 2: Object Storage as First-Class Storage

SSTables don't stay local anymore. They read and write directly to object storage, with a local cache for hot data.

This follows from the economics I described earlier. Here's how it works:

**SSTables on Object Store**: Read and write SSTables directly to S3 or any compatible tier. Local SSTable cache for query hot spots. Asynchronous eviction of cold SSTables to warm and cold tiers based on TTL or access patterns.

**Commit Log Shipping**: Local fsync for the durability guarantee developers expect. Asynchronous shipping to object storage. Recovery and replay from object storage in case of node failure.

**Storage Provider Interface (SPI)**: Treat object storage as a first-class plugin point, the same way we treat compaction strategies or repair algorithms today.

The outcome: most of your bytes live on cheap, durable storage tiers. Cold data costs 90% less. The application doesn't change. Developers keep the same guarantees.

### Move 3: HTAP and Storage-Attached Parquet

Analytics should work at Cassandra speed without moving data.

This bridges the gap between operational and analytical queries. Parquet projections are created directly from SSTables. No ETL, no separate analytics pipeline.

Two paths to keep them current:

- **Online**: Parquet projections written on SSTable flush and compaction. Zero manual configuration.
- **Offline**: Backfill or catch-up jobs for historical data.

Iceberg catalogs track partitions and schema evolution. Then a cost-based query router handles the rest:

- Point and range queries go to SSTables (fast path, consistent P99 latency)
- Wide scans and joins go to the Parquet/Iceberg path (with pushdown and partition pruning, much cheaper per byte scanned)

We're not reinventing the lakehouse. We're connecting cleanly to it. Developers get zero-ETL analytics while keeping their operational queries hot. Same data, two different performance and cost tradeoffs, automatically.

### Move 4: Unified Gateway

Single hostname. Multiple APIs. Same operations surface.

Imagine logging into Cassandra and being able to write:

```
SELECT * FROM users WHERE id = 'user-123';     -- PostgreSQL API
GET user:123;                                  -- Redis/RESP API
db.users.findOne({_id: 'user-123'});          -- MongoDB API
MATCH (u:User {id: 'user-123'}) RETURN u;     -- Graph API
```

All hitting the same underlying state. All using the same auth, quotas, and observability. The Unified Gateway doesn't care which parser handles your query. Pick your dialect per session: PostgreSQL-SQL, CQL (for backward compatibility), RESP, MongoDB, Graph. They all feed the same execution layer.

Developers pick the API, not the product. The Cassandra brand becomes invisible. What matters is that developers get the interface they already know.

## The Phased Roadmap: 2025 to 2035

This doesn't happen overnight.

### Phase 1: Foundations (2025-2027)

**SQL Compatibility Mode**: SQL parser and planner, JDBC and ODBC drivers, PostgreSQL conformance test coverage. Developers can run PostgreSQL workloads against Cassandra.

**Tiered Object Storage**: Reference S3-compatible implementation, lifecycle policies and tiering, snapshots that actually work.

**Parquet Projections**: Writes on flush and compaction, Iceberg metadata integration. Developers can run analytical queries without ETL.

Outcome: cold data costs drop 30-50%. Developers can migrate from PostgreSQL with fewer rewrites. Table format compatibility opens up.

### Phase 2: Convergence (2027-2030)

**Unified Gateway**: Pluggable API layer, native multi-API support, single operations surface for all query types.

**Primary Object Storage**: Read and write SSTables natively to object store. Commit log shipping. Hot, warm, and cold lifecycle automated.

**Analytics Path**: Cost-based router generally available. Parquet and Iceberg projections production ready. Apache Arrow Flight for efficient egress. Developers build analytical pipelines without leaving Cassandra.

Plus: tablets and elastic rebalancing (no more token math), serverless autoscaling, vector-native hybrid search generally available, feature-store patterns first-class.

The [JVector 1.0 release and DiskANN benchmarks](https://foojay.io/today/jvector-1-0-release/) already show where vector search performance is going. By 2027 this capability will be fully mature.

Outcome: developers build against the gateway by default. Most bytes live at the lowest cost tier. OLTP fast path plus unlimited analytics from Parquet. No more ETL.

### Phase 3: Destination (2030-2035)

**Language API Agnostic**: SQL is the default. Unified Gateway achieves parity across all APIs. Full conformance suite.

**Full HTAP**: Cost-based optimizer chooses between the fast operational path and the analytics path automatically. Pushdown to Parquet. Freshness SLOs.

**Read Any Data Format**: External tables for live sources. Query your existing PostgreSQL, MySQL, and MongoDB databases directly. Schema mapping and coercion with conflict resolution rules.

Plus: global edge and sovereign meshes, witness replicas, intent-driven operations, chaos-safe rollouts via sidecar.

Outcome: developers pick the API, not the engine. Zero-ETL operational and analytical queries in the same statement. Point Cassandra at your existing databases and query immediately.

## The North Star: 2035

Be the easiest database to migrate into.

Not the hardest. Not the most specialized. Not the one you architect around for years before you see results.

The one where you drop your existing data files on day one and Cassandra ingests them. No rewriting. No migration pipeline. No three-year transition plan.

That's what "universal state fabric" means. You don't choose Cassandra because it's Cassandra. You choose it because it's the lowest-friction way to manage state at any scale, with any API, from any starting point.

## This Is a Community Effort

I want to be clear: this vision doesn't happen because the Cassandra PMC wishes hard enough. It happens because the community decides it matters.

We have the foundation. We have the momentum. CEPs, contributors, committers, and sub-projects are all growing. [The official Cassandra blog](https://cassandra.apache.org/_/blog.html) tracks this progress in real time. We have the architectural strength that nobody else has built.

What we need now is shared conviction about the direction. It requires design work, implementation work, and honest conversations about what we're willing to change. CQL deprecation? That's a real conversation. Moving storage to object-first? That's a decision with tradeoffs. But the evidence points here, and developers will meet us there.

If you've been in the Cassandra community because you love distributed systems and fault tolerance, I'm asking you to imagine what's possible when we layer the APIs developers actually want on top of that foundation.

If you've been watching from the sidelines because Cassandra felt too specialized, too different from what you already knew, I'm asking you to imagine what it looks like when that gap closes.

The next decade isn't about defending Cassandra as a database product. It's about Cassandra becoming the state fabric that powers databases, caches, search, analytics, and graph engines at the same time.

The question isn't whether this future is possible. We have the proof in object storage adoption, API consolidation trends, and developer preferences that are already in motion.

The question is: are we building it?

Come build this with us. This is open source. This is a community. The next chapter is going to be wild.

---

*This post is based on "Imagining the next 10 years of Cassandra," a talk delivered to the Cassandra community. This is the fourth and final post in a four-part series on database consolidation and what it means for the future of data infrastructure. Read [post 1 on the great database consolidation](/articles/great-database-consolidation/), [post 2 on why Cassandra is winning that consolidation](/articles/cassandra-winning-consolidation/), and [post 3 on Cassandra as the AI data backbone](/articles/cassandra-ai-data-backbone/).*
