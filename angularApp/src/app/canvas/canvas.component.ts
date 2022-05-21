import { Figure } from '../services/types';
import { AppService } from '../services/app.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { drag } from 'd3-drag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() height: number = 600;
  @Input() width: number = 1100;
  subs!: Subscription;

  @ViewChild('canvas', { static: true }) canvas: any;
  constructor(private service: AppService) {}

  ngOnInit(): void {
    const svg = select(this.canvas.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    this.service.getFigures();
    const [drag, resize] = this.dragAndResize(svg, this.service);
    this.subs = this.service
      .select((state) => state.data)
      .subscribe((data) => {
        this.renderRect(data, svg, drag, resize);
      });
  }
  dragAndResize(
    svg: Selection<SVGGElement, unknown, null, undefined>,
    service: AppService
  ) {
    function distance(p1: any, p2: any) {
      return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 0.5);
    }
    let cp = [0, 0],
      g!: Selection<SVGGElement, unknown, null, undefined>,
      W = this.width,
      H = this.height,
      dragStart = false;
    const dragGroup = drag()
      .on('drag', function (d) {
        if (!dragStart) return;
        let x = d.sourceEvent.offsetX,
          y = d.sourceEvent.offsetY;
        cp[0] = cp[0] <= x ? x - cp[0] : (cp[0] - x) * -1;
        cp[1] = cp[1] <= y ? y - cp[1] : (cp[1] - y) * -1;
        cp[2] += cp[0];
        cp[3] += cp[1];
        if (
          cp[2] <= 0 ||
          cp[3] <= 16 ||
          cp[2] + cp[4] >= W ||
          cp[3] + cp[5] >= H
        ) {
          dragStart = false;
          return;
        }
        g.attr('transform', `translate(${cp[2]},${cp[3]} )`)
          .attr('x', (d) => cp[2])
          .attr('y', (d) => cp[3]);
        cp[0] = x;
        cp[1] = y;

        service.updateFigure({ ...d.subject, x: cp[2], y: cp[3] });
      })
      .on('end', function (d) {
        select(this).attr('cursor', 'default');
        dragStart = false;
      })
      .on('start', function (d) {
        cp = [d.sourceEvent.offsetX, d.sourceEvent.offsetY];
        g = svg.select(`g#id${d.subject.id}`);
        cp.push(Number(g.attr('x')));
        cp.push(Number(g.attr('y')));
        cp.push(Number(g.select('.rect1').attr('width')));
        cp.push(Number(g.select('.rect1').attr('height')));
        select(this).attr('cursor', 'move');
        dragStart = true;
      });

    const resize = drag().on('drag', function (d) {
      var dx = d.sourceEvent.offsetX,
        dy = d.sourceEvent.offsetY,
        g = svg.select(`g#id${d.subject.id}`);

      var x = Number(g.attr('x'));
      var y = Number(g.attr('y'));
      var w = Number((this as any).attributes.width.value);
      var h = Number((this as any).attributes.height.value);
      var rect1 = select(this),
        rect2 = g.select(`rect#rect${d.subject.id}`);
      var c1 = { x: x, y: y };
      var c2 = { x: x + w, y: y };
      var c3 = { x: x + w, y: y + h };
      var c4 = { x: x, y: y + h };

      // figure out which corner this is closest to
      var e = { x: dx, y: dy };
      var m1 = distance(e, c1);
      var m2 = distance(e, c2);
      var m3 = distance(e, c3);
      var m4 = distance(e, c4);

      switch (Math.min(m1, m2, m3, m4)) {
        case m2:
          w = w + (e.x - c2.x);
          rect1.attr('width', w + 12);
          rect2.attr('width', w);
          break;
        case m3:
          w = w + (e.x - c3.x);
          h = h + (e.y - c3.y);
          rect1.attr('width', w + 12).attr('height', h + 12);
          rect2.attr('width', w).attr('height', h);
          break;
        case m4:
          h = h + (e.y - c4.y);
          rect1.attr('height', h + 12);
          rect2.attr('height', h);
          break;
      }
      g.select('text').text(`Perimeter: ${w * 2 + h * 2}`);
      service.updateFigure({ ...d.subject, width: w, height: h });
    });
    return [dragGroup, resize];
  }
  renderRect(
    data: Figure[],
    svg: Selection<SVGGElement, unknown, null, undefined>,
    drag: any,
    resize: any
  ): void {
    svg
      .selectAll('g')
      .data(data)
      .join((enter) => {
        const g = enter
          .append('g')
          .attr('id', (d) => `id${d.id}`)
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('transform', (d) => `translate(${d.x},${d.y})`);
        g.append('rect')
          .attr('class', 'rect1')
          .attr('width', (d) => d.width + 12)
          .attr('height', (d) => d.height + 12)
          .attr('fill', '#999')
          .attr('cursor', 'nesw-resize')
          .call(resize);
        g.append('rect')
          .attr('id', (d) => `rect${d.id}`)
          .attr('width', (d) => d.width)
          .attr('height', (d) => d.height)
          .attr('x', 6)
          .attr('y', 6)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('fill', (d) => d.color)
          .call(drag);
        g.append('text')
          .attr('y', -5)
          .attr('fill', (d) => d.color)
          .text((d) => `Perimeter: ${d.width * 2 + d.height * 2}`);
        return g;
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
