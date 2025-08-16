---
layout: article
title: "Running Cassandra on Kubernetes: The K8ssandra Story"
date: 2022-04-20
category: Distributed Systems
reading_time: 7
excerpt: "K8ssandra makes deploying Apache Cassandra on Kubernetes production-ready. Here's what we learned building a cloud-native distribution of the world's most scalable database."
---

*This article is based on my appearance on the Kubernetes Bytes podcast, where I discussed the journey of bringing Apache Cassandra to Kubernetes through the K8ssandra project.*

When we started the K8ssandra project, the question wasn't whether Cassandra could run on Kubernetes - it was whether it could run *well* enough for production workloads. Three years later, with major enterprises running multi-petabyte Cassandra clusters on K8s, I think we have our answer.

## The Challenge: Stateful Meets Cloud Native

Cassandra was designed for a different era - one where servers were pets, not cattle. Its architecture assumes:
- Stable network identities
- Persistent local storage
- Careful orchestration of cluster topology changes

Kubernetes, meanwhile, was built for stateless workloads where instances can be created and destroyed at will. Bridging this gap required rethinking fundamental assumptions about both technologies.

## Enter K8ssandra

K8ssandra isn't just Cassandra running in a container. It's a complete cloud-native distribution that includes:

### Cass Operator
The heart of K8ssandra is the Cass Operator, which encodes years of operational knowledge into Kubernetes controllers. It handles:
- Cluster initialization and scaling
- Rolling upgrades with zero downtime  
- Rack awareness and multi-datacenter deployments
- Integration with Kubernetes storage and networking

### Operational Tools
Running a database requires more than just the database itself:
- **Reaper** for automated repairs
- **Medusa** for backup and restore
- **Stargate** for API access
- **Metrics collectors** for monitoring

### Multi-Cluster Management
The K8ssandra Operator manages Cassandra deployments across multiple Kubernetes clusters, enabling true multi-region deployments with a single control plane.

## Real-World Lessons

### Storage Strategy is Everything

The biggest lesson from production deployments: storage strategy makes or breaks your performance.

```yaml
apiVersion: v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iops: "16000"
  throughput: "1000"
```

For latency-sensitive workloads, local SSDs are still king. But for most use cases, properly configured network storage provides the flexibility needed for cloud native operations.

### Node Affinity and Anti-Affinity

Cassandra's replica placement strategy needs to be coordinated with Kubernetes scheduling:

```yaml
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: cassandra.datastax.com/datacenter
            operator: In
            values:
            - dc1
        topologyKey: kubernetes.io/hostname
```

This ensures replicas are distributed across different nodes, maintaining Cassandra's fault tolerance guarantees.

### Resource Management

Cassandra's resource requirements are predictable but substantial:
- **Memory**: Plan for at least 8GB heap in production
- **CPU**: Cassandra is surprisingly CPU-efficient, but compaction can spike usage
- **Network**: Replication and repair generate significant inter-node traffic

## Multi-Datacenter Magic

One of K8ssandra's most powerful features is seamless multi-datacenter deployments across Kubernetes clusters:

```yaml
apiVersion: k8ssandra.io/v1alpha1
kind: K8ssandraCluster
metadata:
  name: demo
spec:
  cassandra:
    datacenters:
      - metadata:
          name: dc1
        k8sContext: us-east-1
        size: 3
      - metadata:
          name: dc2  
        k8sContext: us-west-2
        size: 3
```

This single manifest creates a globally distributed Cassandra cluster, with each datacenter running in a separate Kubernetes cluster.

## Operational Benefits

### Automated Operations
K8ssandra automates many operational tasks that traditionally required manual intervention:
- **Scaling**: Add or remove nodes with a simple kubectl command
- **Upgrades**: Rolling upgrades that respect Cassandra's operational requirements
- **Repairs**: Automated anti-entropy repairs using Reaper
- **Backups**: Scheduled backups to cloud storage with Medusa

### Observability
Integration with cloud native observability tools provides insights that were difficult to achieve with traditional deployments:
- Prometheus metrics for real-time monitoring
- Jaeger tracing for request flow analysis
- Grafana dashboards for operational visibility

### Infrastructure as Code
The entire cluster configuration is declarative, enabling GitOps workflows and infrastructure automation.

## When to Choose K8ssandra

K8ssandra shines in several scenarios:

### Multi-Cloud Deployments
Organizations that need to run Cassandra across multiple cloud providers benefit from K8ssandra's unified operational model.

### DevOps-First Organizations
Teams already invested in Kubernetes and cloud native tooling can leverage existing expertise and infrastructure.

### Rapid Scaling Requirements
The ability to scale clusters quickly in response to demand makes K8ssandra ideal for variable workloads.

## Challenges and Considerations

### Learning Curve
Running Cassandra on Kubernetes requires understanding both technologies deeply. The abstraction can hide important details that affect performance.

### Resource Overhead
Kubernetes introduces some overhead compared to bare metal deployments. For extremely high-performance use cases, this may be a consideration.

### Networking Complexity
Service meshes and network policies can introduce latency and complexity that affects Cassandra's performance characteristics.

## The Future of Data on Kubernetes

K8ssandra represents a broader trend: the convergence of cloud native and data technologies. As Kubernetes matures, we're seeing:
- More sophisticated operators for complex stateful workloads
- Better storage abstractions that hide infrastructure complexity
- Improved networking that reduces the overhead of container networking

## Getting Started

The barrier to entry for K8ssandra has never been lower:

```bash
helm repo add k8ssandra https://helm.k8ssandra.io/stable
helm install k8ssandra k8ssandra/k8ssandra
```

This single command deploys a complete Cassandra environment with monitoring, backup, and repair capabilities.

## Conclusion

Three years ago, running Cassandra on Kubernetes was an experiment. Today, it's a production-ready approach that offers significant operational advantages over traditional deployments.

K8ssandra proves that cloud native and databases aren't mutually exclusive. With the right abstractions and operational tooling, you can have the scale and reliability of Cassandra with the operational simplicity of Kubernetes.

The future of data is cloud native, and K8ssandra is leading the way.