---
layout: article
title: "Scaling Apache Cassandra on Kubernetes: Lessons from the Field"
date: 2024-01-15
category: Distributed Systems
reading_time: 8
excerpt: "Running stateful workloads on Kubernetes has always been challenging. Here's what I've learned from helping organizations deploy Apache Cassandra on K8s at scale."
---

After years of helping organizations run Apache Cassandra in production, I've seen the landscape shift dramatically toward Kubernetes. While K8s was originally designed for stateless workloads, the community has made tremendous progress in supporting databases and other stateful applications.

## The Challenge of Stateful Sets

When Kubernetes first introduced StatefulSets, it was a game-changer for running databases. However, Cassandra's unique architecture presents some interesting challenges:

1. **Network Identity**: Cassandra nodes need stable network identities to form and maintain clusters
2. **Persistent Storage**: Data must survive pod restarts and rescheduling
3. **Ordered Deployment**: While Cassandra is masterless, careful orchestration during scaling operations is crucial

## Key Lessons Learned

### 1. Storage Performance Matters

The most common performance bottleneck I see is inadequate storage. Cassandra is designed for fast, local SSDs. When running on Kubernetes:

- Use local SSDs when possible (though this limits pod mobility)
- For cloud deployments, provision high-IOPS volumes
- Monitor disk latency religiously - it's often the canary in the coal mine

### 2. Anti-Affinity is Your Friend

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: cassandra
        topologyKey: kubernetes.io/hostname
```

This ensures Cassandra pods are distributed across different nodes, improving fault tolerance.

### 3. Resource Limits Need Careful Tuning

Cassandra's JVM needs careful tuning. Setting resource limits too low can cause constant GC pressure, while setting them too high wastes resources:

- Start with 8GB heap for production workloads
- Use G1GC for heaps larger than 8GB
- Monitor GC pause times and adjust accordingly

### 4. Operators Simplify Operations

The Cassandra community has developed several operators that handle the complexity of running Cassandra on K8s:

- **K8ssandra**: Provides a complete stack including monitoring and repairs
- **Cass Operator**: DataStax's production-ready operator
- **Cassandra Operator**: The original community operator

## The Path Forward

As we move toward a cloud-native future, the intersection of Cassandra and Kubernetes will only become more important. The recent work on vector search capabilities in Cassandra 5.0 opens up exciting possibilities for AI workloads on K8s.

The key is to start small, measure everything, and gradually scale up. The complexity is manageable, and the benefits of unified infrastructure are compelling.

## Conclusion

Running Cassandra on Kubernetes is no longer an experiment - it's production-ready for organizations willing to invest in understanding both technologies. The ecosystem has matured significantly, and with the right approach, you can achieve the scalability and reliability Cassandra is known for, with the operational benefits of Kubernetes.

Remember: distributed systems are hard, but that's what makes them interesting. Happy scaling!